const GameTree = require('@sabaki/immutable-gametree')
const sgf = require('@sabaki/sgf')
const Board = require('./board')
const helper = require('./helper')

const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

let boardCache = {}

exports.new = function() {
    return new GameTree({getId: helper.getId})
}

exports.cloneNode = function(node, parentId = null) {
    if (node == null) return null

    let id = helper.getId()

    return {
        id,
        data: JSON.parse(JSON.stringify(node.data)),
        parentId,
        children: node.children.map(child => exports.cloneNode(child, id))
    }
}

exports.getRootProperty = function(tree, property, fallback = null) {
    let result = ''
    if (property in tree.root.data) result = tree.root.data[property][0]

    return result === '' ? fallback : result
}

exports.mergeInsert = function(tree, id, dataArr) {
    if (dataArr.length === 0) return []

    let ids = null
    let newTree = tree.mutate(draft => {
        let inner = (id, dataArr) => {
            if (dataArr.length === 0) return []

            if (dataArr.length > 1) {
                let ids = inner(id, dataArr.slice(1, -1))
                let lastId = inner(ids.slice(-1)[0], dataArr.slice(-1))

                ids.push(lastId)
                return ids
            }

            let [data] = dataArr
            let node = draft.get(id)
            let nextNode = node.children.find(child =>
                data.B != null && child.data.B != null && data.B[0] === child.data.B[0]
                || data.W != null && child.data.W != null && data.W[0] === child.data.W[0]
            )

            if (nextNode == null) {
                // Append

                let newId = draft.appendNode(id, data)
                return [newId]
            }

            // Merge

            for (let prop in data) {
                if (nextNode.data[prop] != null) continue

                draft.updateProperty(nextNode.id, prop, data[prop])
            }

            return [nextNode.id]
        }

        ids = inner(id, dataArr)
    })

    return {tree: newTree, ids}
}

exports.getMatrixDict = function(tree) {
    let matrix = [...Array(tree.getHeight())].map(_ => [])
    let dict = {}

    let inner = (node, matrix, dict, xshift, yshift) => {
        let sequence = [...tree.getSequence(node.id)]
        let hasCollisions = true

        while (hasCollisions) {
            hasCollisions = false

            for (let y = 0; y < Math.min(sequence.length + 1, matrix.length - yshift); y++) {
                if (xshift >= matrix[yshift + y].length - (y === sequence.length)) continue

                hasCollisions = true
                xshift++
                break
            }
        }

        for (let y = 0; y < sequence.length; y++) {
            matrix[yshift + y].length = xshift + 1
            matrix[yshift + y][xshift] = sequence[y].id
            dict[sequence[y].id] = [xshift, yshift + y]
        }

        let [lastSequenceNode] = sequence.slice(-1)

        for (let k = 0; k < lastSequenceNode.children.length; k++) {
            let child = lastSequenceNode.children[k]
            inner(child, matrix, dict, xshift + k, yshift + sequence.length)
        }

        return [matrix, dict]
    }

    return inner(tree.root, matrix, dict, 0, 0)
}

exports.getMatrixWidth = function(y, matrix) {
    let keys = [...Array(10)]
        .map((_, i) => i + y - 4)
        .filter(i => i >= 0 && i < matrix.length)

    let padding = Math.min(...keys.map(i => {
        for (let j = 0; j < matrix[i].length; j++)
            if (matrix[i][j] != null) return j
        return 0
    }))

    let width = Math.max(...keys.map(i => matrix[i].length)) - padding

    return [width, padding]
}

exports.getBoard = function(tree, id, baseboard = null) {
    let node = tree.get(id)
    let parent = tree.get(node.parentId)
    if (node == null) return null

    let vertex = null
    let board = null

    // Get base board

    if (!baseboard) {
        let prev = tree.get(node.parentId)

        if (!prev) {
            let size = [19, 19]

            if (node.data.SZ != null) {
                let value = node.data.SZ[0]

                if (value.includes(':')) size = value.split(':')
                else size = [value, value]

                size = size.map(x => isNaN(x) ? 19 : +x)
            }

            baseboard = new Board(...size)
        } else {
            baseboard = boardCache[prev.id] || exports.getBoard(tree, prev.id)
        }
    }

    // Make move

    let propData = {B: 1, W: -1}

    for (let prop in propData) {
        if (node.data[prop] == null) continue

        vertex = sgf.parseVertex(node.data[prop][0])
        board = baseboard.makeMove(propData[prop], vertex)
        board.currentVertex = vertex

        break
    }

    if (!board) board = baseboard.clone()

    // Add markup

    propData = {AW: -1, AE: 0, AB: 1}

    for (let prop in propData) {
        if (node.data[prop] == null) continue

        for (let value of node.data[prop]) {
            for (let vertex of sgf.parseCompressedVertices(value)) {
                if (!board.hasVertex(vertex)) continue
                board.set(vertex, propData[prop])
            }
        }
    }

    board.markers = board.arrangement.map(row => row.map(_ => null))

    if (vertex != null && board.hasVertex(vertex)) {
        let [x, y] = vertex
        board.markers[y][x] = {type: 'point'}
    }

    propData = {CR: 'circle', MA: 'cross', SQ: 'square', TR: 'triangle'}

    for (let prop in propData) {
        if (node.data[prop] == null) continue

        for (let value of node.data[prop]) {
            for (let [x, y] of sgf.parseCompressedVertices(value)) {
                if (board.markers[y] == null) continue
                board.markers[y][x] = {type: propData[prop]}
            }
        }
    }

    if (node.data.LB != null) {
        for (let composed of node.data.LB) {
            let sep = composed.indexOf(':')
            let point = composed.slice(0, sep)
            let label = composed.slice(sep + 1)
            let [x, y] = sgf.parseVertex(point)

            if (board.markers[y] == null) continue
            board.markers[y][x] = {type: 'label', label}
        }
    }

    if (node.data.L != null) {
        for (let i = 0; i < node.data.L.length; i++) {
            let point = node.data.L[i]
            let label = alpha[i]
            if (label == null) return
            let [x, y] = sgf.parseVertex(point)

            if (board.markers[y] == null) continue
            board.markers[y][x] = {type: 'label', label}
        }
    }

    for (let type of ['AR', 'LN']) {
        if (node.data[type] == null) continue

        for (let composed of node.data[type]) {
            let sep = composed.indexOf(':')
            let [v1, v2] = [composed.slice(0, sep), composed.slice(sep + 1)].map(sgf.parseVertex)

            board.lines.push({v1, v2, type: type === 'AR' ? 'arrow' : 'line'})
        }
    }

    // Add variation overlays

    let addInfo = (node, list) => {
        let v, sign

        if (node.data.B != null) {
            v = sgf.parseVertex(node.data.B[0])
            sign = 1
        } else if (node.data.W != null) {
            v = sgf.parseVertex(node.data.W[0])
            sign = -1
        } else {
            return
        }

        if (!board.hasVertex(v))
            return

        let type = null

        if (node.data.BM != null) {
            type = 'bad'
        } else if (node.data.DO != null) {
            type = 'doubtful'
        } else if (node.data.IT != null) {
            type = 'interesting'
        } else if (node.data.TE != null) {
            type = 'good'
        }

        list[v] = {sign, type}
    }

    for (let child of node.children) {
        addInfo(child, board.childrenInfo)
    }

    if (parent != null) {
        for (let sibling of parent.children) {
            addInfo(sibling, board.siblingsInfo)
        }
    }

    boardCache[id] = board
    return board
}

exports.clearBoardCache = function() {
    boardCache = {}
}

exports.getHash = function(tree) {
    return helper.hash(JSON.stringify(tree))
}

exports.getMatrixHash = function(tree) {
    let inner = node => helper.hash(`${node.id}-${node.children.map(inner).join('-')}`)
    return inner(tree.root)
}

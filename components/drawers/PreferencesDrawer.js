const {remote} = require('electron')
const {h, Component} = require('preact')
const classNames = require('classnames')
const natsort = require('natsort')

const Drawer = require('./Drawer')

const dialog = require('../../modules/dialog')
const helper = require('../../modules/helper')
const setting = remote.require('./modules/setting')

class PreferencesItem extends Component {
    constructor() {
        super()

        this.handleChange = evt => {
            let {onChange = helper.noop} = this.props
            let {checked} = evt.currentTarget

            setting.set(this.props.id, checked)
            onChange(Object.assign({checked}, this.props))
        }
    }

    shouldComponentUpdate() {
        return false
    }

    render({id, text}) {
        return h('li', {},
            h('label', {},
                h('input', {
                    type: 'checkbox',
                    checked: setting.get(id),
                    onChange: this.handleChange
                }), ' ',

                text
            )
        )
    }
}

class GeneralTab extends Component {
    constructor() {
        super()

        this.handleSoundEnabledChange = evt => {
            sabaki.window.webContents.setAudioMuted(!evt.checked)
        }

        this.handleTreeStyleChange = evt => {
            let data = {compact: [16, 4], spacious: [22, 4], big: [26, 6]}
            let [graphGridSize, graphNodeSize] = data[evt.currentTarget.value]

            setting.set('graph.grid_size', graphGridSize)
            setting.set('graph.node_size', graphNodeSize)
        }
    }

    render({graphGridSize}) {
        return h('div', {class: 'general'},
            h('ul', {},
                h(PreferencesItem, {
                    id: 'app.startup_check_updates',
                    text: 'Check for updates at startup'
                }),
                h(PreferencesItem, {
                    id: 'sound.enable',
                    text: 'Enable sounds',
                    onChange: this.handleSoundEnabledChange
                }),
                h(PreferencesItem, {
                    id: 'game.goto_end_after_loading',
                    text: 'Jump to end after loading file'
                }),
                h(PreferencesItem, {
                    id: 'view.fuzzy_stone_placement',
                    text: 'Fuzzy stone placement'
                }),
                h(PreferencesItem, {
                    id: 'view.animated_stone_placement',
                    text: 'Animate fuzzy placement'
                }),
                h(PreferencesItem, {
                    id: 'file.show_reload_warning',
                    text: 'Offer to reload file if changed externally'
                })
            ),

            h('ul', {},
                h(PreferencesItem, {
                    id: 'comments.show_move_interpretation',
                    text: 'Show automatic move titles'
                }),
                h(PreferencesItem, {
                    id: 'game.show_ko_warning',
                    text: 'Show ko warning'
                }),
                h(PreferencesItem, {
                    id: 'game.show_suicide_warning',
                    text: 'Show suicide warning'
                }),
                h(PreferencesItem, {
                    id: 'edit.show_removenode_warning',
                    text: 'Show remove node warning'
                }),
                h(PreferencesItem, {
                    id: 'edit.show_removeothervariations_warning',
                    text: 'Show remove other variations warning'
                }),
                h(PreferencesItem, {
                    id: 'edit.click_currentvertex_to_remove',
                    text: 'Click last played stone to remove'
                })
            ),

            h('div', {},
                h('p', {}, h('label', {},
                    'Game Tree Style: ',

                    h('select', {onChange: this.handleTreeStyleChange},
                        h('option', {
                            value: 'compact',
                            selected: graphGridSize < 22
                        }, 'Compact'),

                        h('option', {
                            value: 'spacious',
                            selected: graphGridSize === 22
                        }, 'Spacious'),

                        h('option', {
                            value: 'big',
                            selected: graphGridSize > 22
                        }, 'Big')
                    )
                ))
            )
        )
    }
}


class VisualTab extends Component {
    constructor() {
        super()

        this.handlePathChange = evt => {
	    let element = evt.currentTarget
             setting.set(element.id, element.value)
        }

        this.handleBrowseButtonClick = evt => {
            let element = evt.currentTarget
            dialog.showOpenDialog({
                properties: ['openFile', 'multiSelections'],
                // filters: [{name: 'All Files', extensions: ['*']}]
            }, ({result}) => {
                if (!result || result.length === 0) return
		setting.set(element.name, result)
            })
        }

        this.handleThemeChange= evt => {
	    let element = evt.currentTarget
             setting.set('custom_theme', element.value)
        }

    }

    render() {
        return h('div', {class: 'visual'},
            h('p', {},
                h('input', {
		    type: 'text',
		    placeholder: 'path/to/WhiteStones.png',
		    value: setting.get('custom_whitestones'),
		    name: 'whitestones',
                    id: 'custom_whitestones',
		    onChange: this.handlePathChange
                }),
                h('a',
                    {
                        class: 'browse',
			name: 'custom_whitestones',
                        onClick: this.handleBrowseButtonClick
                    },
                    h('img', {
                        src: './node_modules/octicons/build/svg/file-directory.svg',
                        title: 'Browse…',
                        height: 14
                    })
                )
	     ),
            h('p', {},
                h('input', {
		    type: 'text',
		    placeholder: 'path/to/BlackStones.png',
                    id: 'custom_blackstones',
		    value: setting.get('custom_blackstones'),
		    onChange: this.handlePathChange
                }),
                h('a',
                    {
                        class: 'browse',
			name: 'custom_blackstones',
                        onClick: this.handleBrowseButtonClick
                    },
                    h('img', {
                        src: './node_modules/octicons/build/svg/file-directory.svg',
                        title: 'Browse…',
                        height: 14
                    })
                )
	     ),
            h('p', {},
                h('input', {
		    type: 'text',
		    placeholder: 'path/to/Background.png',
                    id: 'custom_background',
		    value: setting.get('custom_background'),
		    onChange: this.handlePathChange
                }),
                h('a',
                    {
                        class: 'browse',
			name: 'custom_background',
                        onClick: this.handleBrowseButtonClick
                    },
                    h('img', {
                        src: './node_modules/octicons/build/svg/file-directory.svg',
                        title: 'Browse…',
                        height: 14
                    })
                )
	     ),

                 h('p', {}, h('label', {}, 'Main Theme: ',
                  h('select',
		    {
                        id: 'custom_theme',
		        onChange: this.handleThemeChange
                    },
                        h('option', {
                            value: '/Users/seth/Desktop/bambooDojoTheme.asar',
                        }, 'Bamboo Dojo'),
                        h('option', {
                            value: '/Users/seth/Desktop/walnutTheme.asar',
                        }, 'Walnut'),
                        h('option', {
                            value: '/Users/seth/Desktop/subduedTheme.asar',
                        }, 'Subdued'),
                        h('option', {
                            value: '/Users/seth/Desktop/slateAndShellTheme.asar',
                        }, 'Slate and Shell')
		   ))
    	          ),
            h('p', {},
              h('button', {onClick: this.handleAddButtonClick}, 'Add')
            )
        )
    }
}

class EngineItem extends Component {
    constructor() {
        super()

this.handleChange = evt => {
            let {onChange = helper.noop} = this.props
            let element = evt.currentTarget
            let data = Object.assign({}, this.props, {
                [element.name]: element.value
            })

            onChange(data)
        }

        this.handleBrowseButtonClick = () => {
            dialog.showOpenDialog({
                properties: ['openFile'],
                filters: [{name: 'All Files', extensions: ['*']}]
            }, ({result}) => {
                if (!result || result.length === 0) return

                let {id, name, args, onChange = helper.noop} = this.props
                onChange({id, name, args, path: result[0]})
            })
        }

        this.handleRemoveButtonClick = () => {
            let {onRemove = helper.noop} = this.props
            onRemove(this.props)
        }
    }

    shouldComponentUpdate({name, path, args}) {
        return name !== this.props.name
            || path !== this.props.path
            || args !== this.props.args
    }

    render({name, path, args}) {
        return h('li', {},
            h('h3', {},
                h('input', {
                    type: 'text',
                    placeholder: '(Unnamed Engine)',
                    value: name,
                    name: 'name',
                    onChange: this.handleChange
                })
            ),
            h('p', {},
                h('input', {
                    type: 'text',
                    placeholder: 'Path',
                    value: path,
                    name: 'path',
                    onChange: this.handleChange
                }),
                h('a',
                    {
                        class: 'browse',
                        onClick: this.handleBrowseButtonClick
                    },

                    h('img', {
                        src: './node_modules/octicons/build/svg/file-directory.svg',
                        title: 'Browse…',
                        height: 14
                    })
                )
            ),
            h('p', {},
                h('input', {
                    type: 'text',
                    placeholder: 'No arguments',
                    value: args,
                    name: 'args',
                    onChange: this.handleChange
                })
            ),
            h('a', {class: 'remove'},
                h('img', {
                    src: './node_modules/octicons/build/svg/x.svg',
                    height: 14,
                    onClick: this.handleRemoveButtonClick
                })
            )
        )
    }
}

class EnginesTab extends Component {
    constructor() {
        super()

        this.handleItemChange = ({id, name, path, args}) => {
            let engines = this.props.engines.slice()

            engines[id] = {name, path, args}
            setting.set('engines.list', engines)
        }

        this.handleItemRemove = ({id}) => {
            let engines = this.props.engines.slice()

            engines.splice(id, 1)
            setting.set('engines.list', engines)
        }

        this.handleAddButtonClick = evt => {
            evt.preventDefault()

            let engines = this.props.engines.slice()

            engines.unshift({name: '', path: '', args: ''})
            setting.set('engines.list', engines)
        }
    }

    render({engines}) {
        return h('div', {class: 'engines'},
            h('div', {class: 'engines-list'},
                h('ul', {}, engines.map(({name, path, args}, id) =>
                    h(EngineItem, {
                        id,
                        name,
                        path,
                        args,

                        onChange: this.handleItemChange,
                        onRemove: this.handleItemRemove
                    })
                ))
            ),

            h('p', {},
                h('button', {onClick: this.handleAddButtonClick}, 'Add')
            )
        )
    }
}

class PreferencesDrawer extends Component {
    constructor() {
        super()

        this.handleCloseButtonClick = evt => {
            evt.preventDefault()
            sabaki.closeDrawer()
        }

        this.handleTabClick = evt => {
            let tabs = ['general', 'visual', 'engines']
            let tab = tabs.find(x => evt.currentTarget.classList.contains(x))

            sabaki.setState({preferencesTab: tab})
        }
    }

    shouldComponentUpdate({show}) {
        return show || show !== this.props.show
    }

    componentDidUpdate(prevProps) {
        if (prevProps.show && !this.props.show) {
            // On closing

            let engines = this.props.engines.slice()
            let cmp = natsort({insensitive: true})

            // Sort engines.

            engines.sort((x, y) => {
                return cmp(x.name, y.name)
            })

            setting.set('engines.list', engines)

            // Reset tab selection

            setTimeout(() => sabaki.setState({preferencesTab: 'general'}), 500)
        }
    }

    render({show, tab, engines, graphGridSize}) {
        return h(Drawer,
            {
                type: 'preferences',
                show
            },

            h('ul', {class: 'tabs'},
                h('li',
                    {
                        class: classNames({general: true, current: tab === 'general'}),
                        onClick: this.handleTabClick
                    },

                    h('a', {href: '#'}, 'General')
                ),
                h('li',
                    {
                        class: classNames({visual: true, current: tab === 'visual'}),
                        onClick: this.handleTabClick
                    },

                    h('a', {href: '#'}, 'Pallete')
                ),   
                h('li',
                    {
                        class: classNames({engines: true, current: tab === 'engines'}),
                        onClick: this.handleTabClick
                    },

                    h('a', {href: '#'}, 'Engines')
                )
            ),

            h('form', {class: tab},
                h(GeneralTab, {graphGridSize}),
	        h(VisualTab, {}),
                h(EnginesTab, {engines}),
                h('p', {},
                    h('button', {onClick: this.handleCloseButtonClick}, 'Close')
                )
            )
        )
    }
}

module.exports = PreferencesDrawer

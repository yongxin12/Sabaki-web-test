# Sabaki Web Version

This is a web-based version of Sabaki, converted from the original Electron desktop application.

## Features Available in Web Version

✅ **Core Features Working:**
- Go board rendering and game play
- SGF file loading via drag & drop or file selection
- Game tree navigation
- Basic editing tools
- Move annotations and comments
- Score estimation
- Settings management (stored in localStorage)

⚠️ **Limited Features:**
- GTP engine support (requires WebAssembly ports)
- File system operations (uses browser File API instead)
- Advanced preferences and themes
- Auto-update functionality

❌ **Not Available:**
- Desktop file associations
- System menu integration
- Direct file system access
- GTP engine integration (complex desktop feature)

## Development

### Prerequisites
- Node.js 14+ and npm

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### File Loading
- Drag and drop SGF/NGF/GIB/UGF files onto the browser window
- Use the File menu to select files via browser file picker
- Files are processed entirely in the browser (no server required)

### Settings
- Settings are automatically saved to browser localStorage
- No manual settings file management required
- Settings persist across browser sessions

## Deployment

The built application is a static website that can be deployed to any web server:

```bash
npm run build
# Deploy the 'dist' folder to your web server
```

Recommended hosting platforms:
- Netlify
- Vercel
- GitHub Pages
- Any static web hosting service

## Browser Compatibility

- Chrome/Chromium 80+
- Firefox 75+
- Safari 13+
- Edge 80+

Modern browser features used:
- File API for file operations
- localStorage for settings
- ES6+ JavaScript features
- CSS Grid and Flexbox

## Differences from Desktop Version

1. **File Operations**: Uses browser File API instead of Node.js fs module
2. **Settings**: Stored in localStorage instead of file system
3. **Engine Support**: Not available (would require WebAssembly GTP engines)
4. **Updates**: No auto-update mechanism
5. **Performance**: Slightly different due to browser limitations

## Known Issues

- Large SGF files may load slower than desktop version
- Some advanced features from desktop version are not implemented
- Browser file picker has different UX than native file dialogs

## Contributing

This web version maintains the same core architecture as the desktop version but with browser-compatible shims for system-level operations. When adding features:

1. Check if desktop functionality can be replicated in browser
2. Add appropriate shims in `src/modules/shims/`
3. Update this README with feature availability
4. Test across different browsers

## License

Same as original Sabaki project - MIT License

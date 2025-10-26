# Converting Markdown to PowerPoint using Pandoc

## What is Pandoc?

Pandoc is a universal document converter that can convert files from one markup format to another. It's perfect for converting our Markdown presentation to PowerPoint.

---

## Installation

### Windows

**Option 1: Download Installer**
1. Go to https://pandoc.org/installing.html
2. Download the Windows installer (.msi file)
3. Run the installer and follow the prompts
4. Restart your terminal/command prompt

**Option 2: Using Chocolatey**
\`\`\`bash
choco install pandoc
\`\`\`

### Mac

**Using Homebrew:**
\`\`\`bash
brew install pandoc
\`\`\`

**Or download from:**
https://pandoc.org/installing.html

### Linux (Ubuntu/Debian)

\`\`\`bash
sudo apt-get update
sudo apt-get install pandoc
\`\`\`

### Verify Installation

\`\`\`bash
pandoc --version
\`\`\`

You should see the Pandoc version information.

---

## Basic Conversion

### Simple Conversion

Navigate to your project directory and run:

\`\`\`bash
pandoc PRESENTATION.md -o ElectricityOutageSystem.pptx
\`\`\`

This creates a basic PowerPoint file from your Markdown.

---

## Advanced Conversion with Styling

### Create a Reference PowerPoint Template

1. **Create a custom template:**
   \`\`\`bash
   pandoc -o reference.pptx --print-default-data-file reference.pptx
   \`\`\`

2. **Customize the template:**
   - Open `reference.pptx` in PowerPoint
   - Modify the master slides (View → Slide Master)
   - Change colors, fonts, layouts
   - Save and close

3. **Use your custom template:**
   \`\`\`bash
   pandoc PRESENTATION.md -o ElectricityOutageSystem.pptx --reference-doc=reference.pptx
   \`\`\`

---

## Conversion with Options

### Full Command with All Options

\`\`\`bash
pandoc PRESENTATION.md \
  -o ElectricityOutageSystem.pptx \
  --reference-doc=reference.pptx \
  -V theme=default \
  --slide-level=2
\`\`\`

### Option Explanations

- `-o ElectricityOutageSystem.pptx` - Output file name
- `--reference-doc=reference.pptx` - Use custom template
- `-V theme=default` - Set theme (default, simple, etc.)
- `--slide-level=2` - Level 2 headers (##) create new slides

---

## Step-by-Step Process in VS Code

### 1. Open Terminal in VS Code

Press `` Ctrl+` `` (backtick) or go to Terminal → New Terminal

### 2. Navigate to Project Directory

\`\`\`bash
cd /path/to/your/project
\`\`\`

### 3. Run Pandoc Command

\`\`\`bash
pandoc PRESENTATION.md -o ElectricityOutageSystem.pptx
\`\`\`

### 4. Open the PowerPoint File

The file `ElectricityOutageSystem.pptx` will be created in your project directory.

---

## Customizing the Presentation

### Adding Images

In your Markdown, use:

\`\`\`markdown
![Image Description](path/to/image.png)
\`\`\`

Then convert:

\`\`\`bash
pandoc PRESENTATION.md -o ElectricityOutageSystem.pptx
\`\`\`

### Slide Breaks

Pandoc uses headers to create slides:

- `# Title` - Creates a title slide
- `## Slide Title` - Creates a new slide
- `---` - Creates a slide break

### Speaker Notes

Add speaker notes in Markdown:

\`\`\`markdown
## Slide Title

Slide content here

::: notes
These are speaker notes that will appear in PowerPoint's notes section.
:::
\`\`\`

---

## Alternative: Manual Conversion

If you prefer not to use Pandoc:

### Method 1: Copy-Paste

1. Open `PRESENTATION.md` in VS Code
2. Open PowerPoint
3. Create a new presentation
4. Copy each slide section from Markdown
5. Paste into PowerPoint slides
6. Format as needed

### Method 2: Use Online Converters

1. **Slides.com** - Import Markdown
2. **Marp** - Markdown presentation tool
3. **Reveal.js** - Web-based presentations

---

## Using Marp (Alternative to Pandoc)

Marp is specifically designed for Markdown presentations.

### Install Marp CLI

\`\`\`bash
npm install -g @marp-team/marp-cli
\`\`\`

### Convert with Marp

\`\`\`bash
marp PRESENTATION.md -o ElectricityOutageSystem.pptx
\`\`\`

### Marp in VS Code

1. Install "Marp for VS Code" extension
2. Open `PRESENTATION.md`
3. Click "Open Preview" button
4. Export to PowerPoint from preview

---

## Recommended Workflow

### For Best Results:

1. **Install Pandoc** (easiest method)
   \`\`\`bash
   # Windows (with Chocolatey)
   choco install pandoc
   
   # Mac (with Homebrew)
   brew install pandoc
   
   # Linux
   sudo apt-get install pandoc
   \`\`\`

2. **Basic Conversion**
   \`\`\`bash
   pandoc PRESENTATION.md -o ElectricityOutageSystem.pptx
   \`\`\`

3. **Open in PowerPoint**
   - Review the slides
   - Add images if needed
   - Adjust formatting
   - Add animations (optional)

4. **Customize Design**
   - Apply PowerPoint themes
   - Adjust colors to match your institution
   - Add your institution's logo

---

## Troubleshooting

### Pandoc Command Not Found

**Solution:**
- Restart your terminal after installation
- Check if Pandoc is in your PATH
- Try full path: `C:\Program Files\Pandoc\pandoc.exe` (Windows)

### Images Not Showing

**Solution:**
- Use relative paths: `./images/diagram.png`
- Or use absolute paths
- Ensure images exist in the specified location

### Formatting Issues

**Solution:**
- Use a reference document: `--reference-doc=template.pptx`
- Manually adjust in PowerPoint after conversion
- Check Markdown syntax is correct

### Slide Breaks Not Working

**Solution:**
- Ensure you're using `##` for slide titles
- Add `---` for manual breaks
- Use `--slide-level=2` option

---

## Quick Reference Commands

\`\`\`bash
# Basic conversion
pandoc PRESENTATION.md -o output.pptx

# With custom template
pandoc PRESENTATION.md -o output.pptx --reference-doc=template.pptx

# With slide level specification
pandoc PRESENTATION.md -o output.pptx --slide-level=2

# Convert with metadata
pandoc PRESENTATION.md -o output.pptx --metadata title="My Presentation"

# Preview as HTML first
pandoc PRESENTATION.md -o preview.html -s
\`\`\`

---

## Final Tips

1. **Preview First**: Convert to HTML to preview before PowerPoint
   \`\`\`bash
   pandoc PRESENTATION.md -o preview.html -s
   \`\`\`

2. **Keep Markdown Simple**: Complex formatting may not convert perfectly

3. **Use PowerPoint for Final Touch**: Convert with Pandoc, then polish in PowerPoint

4. **Test Early**: Convert early and often to catch formatting issues

5. **Backup**: Keep your Markdown file as the source of truth

---

## Resources

- **Pandoc Documentation**: https://pandoc.org/MANUAL.html
- **Pandoc PowerPoint Guide**: https://pandoc.org/MANUAL.html#producing-slide-shows-with-pandoc
- **Marp Documentation**: https://marp.app/
- **Markdown Guide**: https://www.markdownguide.org/

---

## Need Help?

If you encounter issues:

1. Check Pandoc version: `pandoc --version`
2. Verify Markdown syntax
3. Try basic conversion first
4. Check Pandoc documentation
5. Use online Markdown to PowerPoint converters as backup

Good luck with your presentation! 🎓

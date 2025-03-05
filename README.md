# Edonis Reads: Your Personal Digital Library

![Edonis Reads](https://img.shields.io/badge/Edonis%20Reads-v1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 📚 Overview

Edonis Reads is a personal web application designed to help organize, manage, and access my collection of books, highlights, and notes in one beautiful interface. Create a digital library of your reading materials, organize books by themes, and quickly search through all your highlights. While this project is primarily for my own use, I welcome anyone who is interested to fork it and make it their own!

## ✨ Features

- **Digital Book Library**: Upload and organize your books in a clean, intuitive sidebar.
- **Detailed Book Entries**: Each book includes:
  - Overview/summary
  - Key themes with detailed explanations
  - Significant quotes
  - Literary and historical significance
- **Highlight Management**: Store and categorize highlights and notes from your books.
- **Theme Switching**: Toggle between light and dark modes for comfortable reading in any environment.
- **Full-Text Search**: Quickly find specific highlights across your entire library.
- **Responsive Design**: Access your library on any device with a beautiful, adaptive interface.
- **No Backend Required**: All data is stored locally in your browser.

## 🖥️ Screenshots

*[Screenshots would be added here]*

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Your book highlights and notes (exported from your Kindle device or app)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/edonisth/e-reads.git
   ```

2. Open the project folder:
   ```bash
   cd e-reads
   ```

3. Open `index.html` in your web browser or set up a local server.

### Using with a Local Server

For the best experience, you can run Edonis Reads using a local server:

```bash
# Using Python
python -m http.server

# Using Node.js and npm
npm install -g http-server
http-server
```

Then open `http://localhost:8000` (or the port provided) in your browser.

## 📖 How to Use

1. **Adding Books**: Click the "+" button in the sidebar to add a new book.
2. **Book Details**: Fill in the title, author, and upload a cover image.
3. **Adding Highlights**: Add themes and quotes from your book.
4. **Searching**: Use the search bar to find specific highlights across all books.
5. **Dark/Light Mode**: Toggle between dark and light mode using the moon/sun icon.

## 🧩 Project Structure

```
e-reads/
├── index.html          # Main HTML file
├── style.css           # CSS styles
├── script.js           # JavaScript functionality
├── book-template.json  # Template for book data structure
├── covers/             # Directory for book cover images
└── README.md           # Project documentation
```

## 🔧 Technical Details

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: LocalStorage for saving book data
- **Dependencies**: 
  - Font Awesome (for icons)
  - Google Fonts (Inter and Space Mono)

## 📚 Current Book Collection

The current collection includes works across various genres and time periods:

- **Philosophy**: Pascal's "Pensées", Nietzsche's "The Birth of Tragedy"
- **Science Fiction**: Frank Herbert's "Dune" series, Douglas Adams' "The Hitchhiker's Guide to the Galaxy"
- **Transcendentalism**: Thoreau's "Walden & Civil Disobedience"
- **Technology & Privacy**: Assange's "Cypherpunks", Collier's "Tor"
- **Economics**: "The Bitcoin Standard"
- **Literature**: McCarthy's "Blood Meridian", Gogol's "The Nose"
- **Classical Works**: Horace's "Odes"
- **Japanese Literature**: Mishima's "Sun & Steel"

## 🛣️ Roadmap

- [ ] Export/import functionality for backup
- [ ] Cloud synchronization
- [ ] Book statistics and reading insights
- [ ] Tagging system for highlights
- [ ] Mobile app version

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

- **Edonis Th** - [GitHub](https://github.com/edonisth)

## 🙏 Acknowledgements

- Inspired by the need for better book management and the preservation of knowledge.
- Thanks to all the readers who value literature and its insights.

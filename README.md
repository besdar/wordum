# Wordum

## Overview

Wordum is a powerful language learning application designed to help users expand their vocabulary through interactive flashcards. Built with [React Native](https://reactnative.dev), Wordum offers a seamless experience for learners of all levels. 

## Features

- **Flashcard Collections**: Create and manage collections of flashcards tailored to your learning needs.
- **Automatic Field Filling**: Simply input a word or phrase, and the app will automatically populate translation, audio, and usage examples.
- **Diverse Learning Exercises**: Engage with various exercises, including listening and writing, to reinforce your learning.
- **Customizable Learning Material**: The app adapts to the material you design, ensuring a personalized learning experience.
- [**Open Spaced Repetition Algorithm**](https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm): Utilizes the same effective learning algorithm as the popular [Anki app](https://github.com/ankitects/anki) to optimize your study sessions.
- **Open Source**: Wordum is completely open source and [licensed under GPL3](./LICENSE), encouraging collaboration and contributions from the community.

## Current Status

Wordum is currently in public beta. While releases are available for Android, contributions to expand the app to other platforms are highly welcomed. 

## Demos

![Screenshot 1](path/to/screenshot1.png)
![Screenshot 2](path/to/screenshot2.png)
![Screenshot 3](path/to/screenshot3.png)
![Demo 1](path/to/demo1.gif)
![Demo 2](path/to/demo2.gif)

## Building Your Own Android Build

To build your own version of the Wordum app for Android, follow these steps:

### Prerequisites

- Ensure you have [Node.js](https://nodejs.org/) installed.
- Setup your environment for [React Native](https://reactnative.dev/docs/environment-setup).
- Set up [Android Studio](https://developer.android.com/studio) and ensure you have the Android SDK installed.

### Steps to Build

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/wordum.git
   cd wordum
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start an android AVD or connect android device**

4. **Start the Metro development Server**:
   ```bash
   npm start
   ```

This will build the app and launch it on your connected Android device or emulator.

## License

Wordum is licensed under the GPL-3.0 license. For more details, please refer to the [LICENSE](./LICENSE) file.

---

Thank you for your interest in Wordum! Happy learning!
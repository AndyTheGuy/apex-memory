# Contributing to ApexMemory

Thank you for your interest in improving ApexMemory! To maintain a highly professional, reliable, and secure codebase, all contributions must follow the guidelines outlined below. 

As the project maintainer, **@AndyTheGuy** retains sole review and merge authority. Direct pushes to the `main` branch are blocked.

---

## 🛠️ Code of Conduct & Philosophy
- **Boring is Beautiful:** We prioritize clean, standard JavaScript, native platform APIs, and plain Markdown configurations. Avoid introducing heavy external frameworks or compiled binary databases unless absolutely necessary.
- **Privacy-First:** This is a 100% offline, local system. Never introduce dependencies or logic that send private code, conversations, or keys to external cloud services without explicit, opt-in user settings.

---

## 📬 Proposing Changes (The PR Workflow)

To prevent unapproved or breaking modifications, all code changes must undergo formal pull request review:

1. **Fork the Repository:** Create a personal copy of this repository on GitHub.
2. **Create a Feature Branch:** Branch off `main` with a descriptive name:
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```
3. **Write Clean Code:** Follow the style patterns present in the `src/` directory:
   - Use dynamic paths (e.g. `require('os').homedir()`) instead of hardcoded user directories.
   - Use ESModule dynamic imports or structured CommonJS cleanly.
   - Match the comment density and descriptive function naming of the surrounding files.
4. **Run Local Tests:** Ensure your modifications compile cleanly and don't break snapshot compilations. Run:
   ```bash
   npm run snapshot
   ```
5. **Open a Pull Request:** Submit your branch as a PR against the `main` branch of `AndyTheGuy/apex-memory`.
6. **Code Review:** @AndyTheGuy will inspect your code, request edits if needed, and merge it once approved.

---

## 🐛 Reporting Bugs & Suggestions

- To report issues or suggest optimizations, please open a formal issue inside the **GitHub Issues** tab.
- Use the provided **Bug Report** or **Feature Request** templates to keep input structured, helping us debug and integrate changes efficiently.

We appreciate your contributions to the Claude Code developer ecosystem!

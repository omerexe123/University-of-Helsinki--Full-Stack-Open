import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"], 
    languageOptions: { 
      sourceType: "commonjs", 
      globals: {
        ...globals.node, // Bu satır 'process' hatalarını çözer (Node ortamı)
        ...globals.browser // Eğer frontend kodun da varsa kalabilir
      } 
    } 
  },
  pluginJs.configs.recommended,
  {
    // Özel kurallarını buraya ekleyebilirsin
    rules: {
      "no-unused-vars": "warn", // 'result' is defined but never used hatasını uyarıya çevirir
      "no-console": "off",      // console.log kullanmana izin verir
    }
  }
];
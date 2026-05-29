<<<<<<< HEAD
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
=======
import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
>>>>>>> a2b49ff5228bf84842249119fa533d00a0660ede

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
<<<<<<< HEAD
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
=======
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
>>>>>>> a2b49ff5228bf84842249119fa533d00a0660ede
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...reactRefresh.configs.vite.rules,
<<<<<<< HEAD

      // สั่งปิดการแจ้งเตือน
      "no-unused-vars": "off",
      "react-refresh/only-export-components": "off",
=======
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
      'no-unused-vars': ['error', { varsIgnorePattern: '^React$' }],
    },
    settings: {
      react: {
        version: 'detect',
      },
>>>>>>> a2b49ff5228bf84842249119fa533d00a0660ede
    },
  },
]);

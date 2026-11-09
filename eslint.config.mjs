
import js from "@eslint/js";
import globals from "globals";

export default [
    {
        files: ["public/js/code.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "script",
            globals: globals.browser
        },
        rules: {
            ...js.configs.recommended.rules,
            "no-unused-vars": "warn",
            "eqeqeq": "warn"
        }
    },
    {
        ignores: ["node_modules/**", "public/js/md5.js"]
    }
];

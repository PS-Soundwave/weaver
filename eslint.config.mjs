import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
    baseDirectory: import.meta.dir
});

const config = [
    ...compat.config({
        extends: ["next/core-web-vitals", "next/typescript"]
    }),
    {
        rules: {
            "array-callback-return": "error",
            "for-direction": "error",
            "no-async-promise-executor": "error",
            "no-compare-neg-zero": "error",
            "no-cond-assign": ["error", "always"],
            "no-constant-binary-expression": "error",
            "no-constant-condition": "error",
            "no-constructor-return": "error",
            "no-debugger": "error",
            "no-dupe-else-if": "error",
            "no-duplicate-case": "error",
            "no-duplicate-imports": "error",
            "no-empty-character-class": "error",
            "no-empty-pattern": "error",
            "no-ex-assign": "error",
            "no-fallthrough": "error",
            "no-inner-declarations": ["error", "both"],
            "no-invalid-regexp": "error",
            "no-irregular-whitespace": ["error", { skipTemplates: true }],
            "no-loss-of-precision": "error",
            "no-misleading-character-class": ["error", { allowEscape: true }],
            "no-prototype-builtins": "error",
            "no-self-assign": "error",
            "no-self-compare": "error",
            "no-sparse-arrays": "error",
            "no-unexpected-multiline": "error",
            "no-unmodified-loop-condition": "error",
            "no-unreachable-loop": "error",
            "no-unsafe-finally": "error",
            "no-unsafe-negation": [
                "error",
                { enforceForOrderingRelations: true }
            ],
            "no-unsafe-optional-chaining": [
                "error",
                { disallowArithmeticOperators: true }
            ],
            "no-unused-private-class-members": "error",
            "no-unused-vars": [
                "error",
                {
                    args: "all",
                    argsIgnorePattern: "^_",
                    destructuredArrayIgnorePattern: "^_",
                    ignoreClassWithStaticInitBlock: true
                }
            ],
            "no-useless-assignment": "error",
            "no-useless-backreference": "error",
            "require-atomic-updates": ["error", { allowProperties: true }],
            "use-isnan": "error",
            "valid-typeof": "error",

            "accessor-pairs": "error",
            "block-scoped-var": "error",
            "consistent-return": [
                "error",
                { treatUndefinedAsUnspecified: true }
            ],
            curly: "error",
            "default-case": "error",
            "default-case-last": "error",
            "default-param-last": "error",
            "dot-notation": "error",
            eqeqeq: "error",
            "func-name-matching": [
                "error",
                {
                    considerPropertyDescriptor: true,
                    includeCommonJSModuleExports: true
                }
            ],
            "func-style": ["error", "expression"],
            "grouped-accessor-pairs": ["error", "setBeforeGet"],
            "guard-for-in": "error",
            "no-alert": "error",
            "no-array-constructor": "error",
            "no-caller": "error",
            "no-case-declarations": "error",
            "no-delete-var": "error",
            "no-else-return": "error",
            "no-empty": ["error", { allowEmptyCatch: true }],
            "no-empty-function": "error",
            "no-empty-static-block": "error",
            "no-eq-null": "error",
            "no-eval": "error",
            "no-extend-native": "error",
            "no-extra-bind": "error",
            "no-extra-boolean-cast": [
                "error",
                { enforceForLogicalOperands: true }
            ],
            "no-extra-label": "error",
            "no-global-assign": "error",
            "no-implicit-coercion": "error",
            "no-implicit-globals": "error",
            "no-implied-eval": "error",
            "no-invalid-this": "error",
            "no-iterator": "error",
            "no-label-var": "error",
            "no-lone-blocks": "error",
            "no-lonely-if": "error",
            "no-loop-func": "error",
            "no-multi-assign": "error",
            "no-new": "error",
            "no-new-func": "error",
            "no-new-wrappers": "error",
            "no-nonoctal-decimal-escape": "error",
            "no-object-constructor": "error",
            "no-octal": "error",
            "no-octal-escape": "error",
            "no-proto": "error",
            "no-script-url": "error",
            "no-sequences": "error",
            "no-shadow-restricted-names": "error",
            "no-throw-literal": "error",
            "no-undef-init": "error",
            "no-unneeded-ternary": "error",
            "no-unused-expressions": ["error", { enforceForJSX: true }],
            "no-unused-labels": "error",
            "no-useless-call": "error",
            "no-useless-catch": "error",
            "no-useless-computed-key": "error",
            "no-useless-concat": "error",
            "no-useless-constructor": "error",
            "no-useless-escape": "error",
            "no-useless-rename": "error",
            "no-useless-return": "error",
            "no-var": "error",
            "no-void": "error",
            "no-warning-comments": "warn",
            "no-with": "error",
            "object-shorthand": "error",
            "one-var": ["error", "never"],
            "prefer-arrow-callback": ["error", { allowUnboundThis: false }],
            "prefer-const": ["error", { destructuring: "all" }],
            "prefer-exponentiation-operator": "error",
            "prefer-named-capture-group": "error",
            "prefer-numeric-literals": "error",
            "prefer-object-has-own": "error",
            "prefer-object-spread": "error",
            "prefer-promise-reject-errors": "error",
            "prefer-regex-literals": [
                "error",
                { disallowRedundantWrapping: true }
            ],
            "prefer-rest-params": "error",
            "prefer-spread": "error",
            "prefer-template": "error",
            radix: ["error", "as-needed"],
            "require-unicode-regexp": ["error", { requireFlag: "v" }],
            "require-yield": "error",
            "vars-on-top": "error",
            yoda: ["error", "never", { exceptRange: true }],

            "@typescript-eslint/no-explicit-any": "off"
        }
    }
];

export default config;

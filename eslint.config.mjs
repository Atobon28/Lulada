// eslint.config.mjs - Configuración corregida para ESLint v9
import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        
        // DOM globals
        HTMLElement: 'readonly',
        Element: 'readonly',
        Node: 'readonly',
        NodeList: 'readonly',
        NodeListOf: 'readonly',
        Event: 'readonly',
        CustomEvent: 'readonly',
        EventTarget: 'readonly',
        MouseEvent: 'readonly',
        KeyboardEvent: 'readonly',
        StorageEvent: 'readonly',
        ShadowRoot: 'readonly',
        
        // Browser APIs
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        btoa: 'readonly',
        atob: 'readonly',
        URL: 'readonly',
        FileReader: 'readonly',
        FormData: 'readonly',
        File: 'readonly',
        Blob: 'readonly',
        customElements: 'readonly',
        ResizeObserver: 'readonly',
        IntersectionObserver: 'readonly',
        MutationObserver: 'readonly'
      }
    },
    rules: {
      // Variables no utilizadas - permitir las que empiecen con _
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_'
        }
      ],
      
      // Desactivar no-undef ya que es problemático con tipos de TypeScript
      'no-undef': 'off',
      
      // Hacer menos estrictas algunas reglas
      'no-empty': 'warn',
      'no-constant-condition': 'warn'
    }
  },
  {
    // Archivos TypeScript específicos con reglas adicionales
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: await import('@typescript-eslint/parser').then(m => m.default),
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': await import('@typescript-eslint/eslint-plugin').then(m => m.default)
    },
    rules: {
      // Sobrescribir la regla base con la de TypeScript
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      
      // Reglas de TypeScript más permisivas
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off'
    }
  },
  {
    // Archivos a ignorar
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '**/*.min.js',
      '**/*.d.ts',
      '.DS_Store',
      '**/.DS_Store',
      'src/Components/Home/Navbar/sidebar copy.ts'
    ]
  }
];
import type { Configuration } from 'webpack';

module.exports = {
    entry: { 
        background: 'projects/extension/src/background.ts',
        content: 'projects/extension/src/contentscript.ts',
        page: 'projects/extension/src/page.ts'
    },
} as Configuration;
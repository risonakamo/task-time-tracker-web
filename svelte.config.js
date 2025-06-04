import {vitePreprocess} from "@sveltejs/vite-plugin-svelte";
export default {
    preprocess: vitePreprocess(),
    compilerOptions:{
        warningFilter(warning)
        {
            if (
                warning.code.includes("a11y")
                || warning.code.includes("css_unused")
            )
            {
                return;
            }
            return warning;
        }
    }
};

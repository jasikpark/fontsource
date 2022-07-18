import { defineConfig } from 'vitest/config'
import { join } from "pathe"

export default defineConfig({
    test: {
        clearMocks: true,
    },
})
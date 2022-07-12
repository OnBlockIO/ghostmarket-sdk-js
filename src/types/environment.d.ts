declare global {
    namespace NodeJS {
        interface ProcessEnv {
            GM_API_KEY: string
            INFURA_API_KEY: string
            PRIVATE_KEY: string
            MNEMONIC: string
        }
    }
}

export {}

//When will turn on {ssr:true}, the meQuery that fetches the user turns to null but when we use this, it will retain the user

export const isServer = () => typeof window === "undefined";

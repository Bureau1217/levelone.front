// vue.config.js


/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
    // Vercel serves its own build (preview links): assets from its domain.
    // Any other production build keeps loading them from commergnat.com.
    publicPath: process.env.NODE_ENV === 'development' ? ""
        : process.env.VERCEL ? "/"
        : "https://commergnat.com/"
}

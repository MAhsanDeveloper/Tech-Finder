class TechDetector {
  constructor() {
    this.categories = {
      frameworks: [],
      libraries: [],
      "ui-frameworks": [],
      styling: [],
      hosting: [],
      cdn: [],
      analytics: [],
      payment: [],
      security: [],
      paas: [],
      tools: [],
      "reverse-proxies": [],
      "customer-data": [],
      "tag-managers": [],
      advertising: [],
      "live-chat": [],
      editors: [],
      "issue-trackers": [],
      "web-servers": [],
      "static-generators": [],
      performance: [],
      pwa: [],
      misc: [],
    }
    this.init()
  }

  init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this.setupEventListeners()
        this.detectTechnologies()
      })
    } else {
      this.setupEventListeners()
      this.detectTechnologies()
    }
  }

  setupEventListeners() {
    const refreshBtn = document.getElementById("refresh-btn")
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        this.detectTechnologies()
      })
    }

    chrome.runtime.onMessage.addListener((message) => {
      this.handleMessage(message)
    })
  }

  detectTechnologies() {
    this.showLoading()
    this.clearCategories()

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) {
        this.showError()
        return
      }

      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: detectTechnologiesInPage,
        },
        (result) => {
          if (chrome.runtime.lastError) {
            console.error("Script injection failed:", chrome.runtime.lastError)
            this.showError()
          }
        },
      )
    })

    setTimeout(() => {
      const loadingElement = document.getElementById("loading")
      if (loadingElement && !loadingElement.classList.contains("hidden")) {
        this.showNoTech()
      }
    }, 10000)
  }

  handleMessage(message) {
    if (message.type === "TECHS_DETECTED") {
      this.displayResults(message.techs)
    } else if (message.type === "ERROR") {
      this.showError()
    }
  }

  displayResults(techs) {
    this.hideLoading()
    const hasAnyTech = Object.values(techs).some((category) => category.length > 0)

    if (!hasAnyTech) {
      this.showNoTech()
      return
    }

    const resultsElement = document.getElementById("results")
    if (resultsElement) {
      resultsElement.classList.remove("hidden")
    }

    Object.entries(techs).forEach(([category, items]) => {
      const listElement = document.getElementById(`${category}-list`)
      const sectionElement = document.getElementById(`${category}-section`)

      if (items.length > 0 && listElement && sectionElement) {
        listElement.innerHTML = ""
        items.forEach((tech) => {
          const li = document.createElement("li")
          li.innerHTML = `
            <span class="tech-name">${tech.name}</span>
            <div class="tech-meta">
              ${tech.version ? `<span class="tech-version">v${tech.version}</span>` : ""}
              ${
                tech.confidence >= 70
                  ? `<span class="tech-confidence tech-confidence-high">${tech.confidence}%</span>`
                  : tech.confidence >= 40
                    ? `<span class="tech-confidence tech-confidence-medium">${tech.confidence}%</span>`
                    : `<span class="tech-confidence tech-confidence-low">${tech.confidence}%</span>`
              }
            </div>
          `
          if (tech.class) {
            li.classList.add(tech.class)
          }
          listElement.appendChild(li)
        })
        sectionElement.classList.remove("hidden")
      } else if (sectionElement) {
        sectionElement.classList.add("hidden")
      }
    })
  }

  showLoading() {
    const elements = {
      loading: document.getElementById("loading"),
      results: document.getElementById("results"),
      error: document.getElementById("error"),
      noTech: document.getElementById("no-tech"),
    }

    if (elements.loading) elements.loading.classList.remove("hidden")
    if (elements.results) elements.results.classList.add("hidden")
    if (elements.error) elements.error.classList.add("hidden")
    if (elements.noTech) elements.noTech.classList.add("hidden")
  }

  hideLoading() {
    const loadingElement = document.getElementById("loading")
    if (loadingElement) {
      loadingElement.classList.add("hidden")
    }
  }

  showError() {
    this.hideLoading()
    const errorElement = document.getElementById("error")
    if (errorElement) {
      errorElement.classList.remove("hidden")
    }
  }

  showNoTech() {
    this.hideLoading()
    const noTechElement = document.getElementById("no-tech")
    if (noTechElement) {
      noTechElement.classList.remove("hidden")
    }
  }

  clearCategories() {
    Object.keys(this.categories).forEach((key) => {
      this.categories[key] = []
    })
  }
}

// COMPREHENSIVE DETECTION FUNCTION WITH ENHANCED REACT DETECTION
function detectTechnologiesInPage() {
  const detectedTechs = {
    frameworks: [],
    libraries: [],
    "ui-frameworks": [],
    styling: [],
    hosting: [],
    cdn: [],
    analytics: [],
    payment: [],
    security: [],
    paas: [],
    tools: [],
    "reverse-proxies": [],
    "customer-data": [],
    "tag-managers": [],
    advertising: [],
    "live-chat": [],
    editors: [],
    "issue-trackers": [],
    "web-servers": [],
    "static-generators": [],
    performance: [],
    pwa: [],
    misc: [],
  }

  // Comprehensive technology signatures database
  const techSignatures = {
    // ENHANCED REACT DETECTION (ONLY THIS ONE IS ENHANCED)
    React: {
      category: "frameworks",
      patterns: {
        js: ["React", "ReactDOM"],
        dom: [
          "[data-reactroot]",
          "[data-reactid]",
          "#react-root",
          "[data-react-helmet]",
          "[data-react-class]",
          "#root",
        ],
        scripts: [
          "react.min.js",
          "react.development.js",
          "react.production.min.js",
          "/react@",
          "/react/",
          "react/umd",
          "unpkg.com/react",
          "cdn.jsdelivr.net/npm/react",
          "react-dom",
          "/static/js/",
          "chunk.js",
          "bundle.js",
        ],
        globals: ["__REACT_DEVTOOLS_GLOBAL_HOOK__"],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      customDetection: () => {
        // Enhanced React detection
        let confidence = 0

        // Check for React DevTools
        if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) confidence += 50

        // Check for React Fiber properties
        const elements = document.querySelectorAll("*")
        for (let i = 0; i < Math.min(elements.length, 50); i++) {
          const el = elements[i]
          const keys = Object.keys(el)
          if (
            keys.some(
              (key) =>
                key.startsWith("__reactInternalInstance") ||
                key.startsWith("__reactFiber") ||
                key.startsWith("_reactInternalFiber"),
            )
          ) {
            confidence += 40
            break
          }
        }

        // Check for React in window
        if (window.React || window.ReactDOM) confidence += 35

        // Check for React root elements
        if (document.querySelector("#root, #react-root, [data-reactroot]")) confidence += 30

        // Check for React patterns in scripts
        const scripts = Array.from(document.querySelectorAll("script:not([src])"))
        for (const script of scripts) {
          const content = script.textContent || ""
          if (
            content.includes("React.createElement") ||
            content.includes("jsx") ||
            content.includes("_jsx") ||
            content.includes("useState") ||
            content.includes("useEffect")
          ) {
            confidence += 35
            break
          }
        }

        return confidence
      },
      version: () => window.React?.version,
      weight: 40,
    },

    // ALL OTHER ORIGINAL DETECTIONS (UNCHANGED)
    "Next.js": {
      category: "frameworks",
      patterns: {
        js: ["__NEXT_DATA__", "__NEXT_LOADED_PAGES__", "__BUILD_MANIFEST"],
        dom: ["#__next", '[id^="__next"]'],
        scripts: ["/_next/", "_next/static", "next/dist", "_next/webpack"],
        globals: ["__NEXT_DATA__", "__BUILD_MANIFEST"],
        meta: [{ name: "generator", content: "Next.js" }],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      customDetection: () => {
        let confidence = 0
        if (window.__NEXT_DATA__) confidence += 50
        if (document.querySelector("#__next")) confidence += 30
        const scripts = Array.from(document.querySelectorAll("script[src]"))
        if (scripts.some((s) => s.src.includes("_next/"))) confidence += 40
        return confidence
      },
      weight: 50,
    },

    AngularJS: {
      category: "frameworks",
      patterns: {
        js: ["angular"],
        dom: ["[ng-app]", "[data-ng-app]", "[ng-controller]", "[ng-version]", "[ng-bind]", "[ng-repeat]", "[ng-if]"],
        scripts: ["angular.min.js", "angular.js", "/angular@", "angularjs"],
        globals: ["angular"],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      version: () => window.angular?.version?.full,
      weight: 40,
    },

    "Vue.js": {
      category: "frameworks",
      patterns: {
        js: ["Vue", "__VUE__"],
        dom: ["[data-v-]", "[v-if]", "[v-for]", "[v-model]", "[v-show]", "[v-bind]", "[v-on]"],
        scripts: ["vue.min.js", "vue.js", "/vue@", "vue/dist"],
        globals: ["Vue", "__VUE__"],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      version: () => window.Vue?.version,
      weight: 40,
    },

    Angular: {
      category: "frameworks",
      patterns: {
        js: ["ng", "Zone"],
        dom: ["[ng-version]", "[_ngcontent-]", "[_nghost-]", "app-root"],
        scripts: ["@angular/", "angular/core"],
        globals: ["ng", "Zone"],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      version: () => {
        const versionEl = document.querySelector("[ng-version]")
        return versionEl ? versionEl.getAttribute("ng-version") : null
      },
      weight: 40,
    },

    // LIBRARIES
    "React Router": {
      category: "libraries",
      patterns: {
        js: ["ReactRouter"],
        dom: [],
        scripts: ["react-router", "react-router-dom", "/react-router@"],
        globals: [],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      customDetection: () => {
        const scripts = Array.from(document.querySelectorAll("script[src]"))
        for (const script of scripts) {
          const match = script.src.match(/react-router(?:-dom)?@?(\d+\.\d+\.\d+)/)
          if (match) return 60
        }
        return 0
      },
      version: () => {
        const scripts = Array.from(document.querySelectorAll("script[src]"))
        for (const script of scripts) {
          const match = script.src.match(/react-router(?:-dom)?@?(\d+\.\d+\.\d+)/)
          if (match) return match[1]
        }
        return null
      },
      weight: 30,
    },

    MobX: {
      category: "libraries",
      patterns: {
        js: ["mobx", "__mobxDidRunLazyInitializers", "__mobxInstanceCount"],
        dom: [],
        scripts: ["mobx.min.js", "mobx.js", "/mobx@"],
        globals: ["mobx", "__mobxDidRunLazyInitializers"],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      weight: 30,
    },

    "Framer Motion": {
      category: "libraries",
      patterns: {
        js: [],
        dom: [],
        scripts: ["framer-motion", "/framer-motion@"],
        globals: [],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      weight: 30,
    },

    "core-js": {
      category: "libraries",
      patterns: {
        js: [],
        dom: [],
        scripts: ["core-js", "/core-js@"],
        globals: [],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      version: () => {
        const scripts = Array.from(document.querySelectorAll("script[src]"))
        for (const script of scripts) {
          const match = script.src.match(/core-js@(\d+\.\d+\.\d+)/)
          if (match) return match[1]
        }
        return null
      },
      weight: 25,
    },

    "crypto-js": {
      category: "libraries",
      patterns: {
        js: ["CryptoJS"],
        dom: [],
        scripts: ["crypto-js", "/crypto-js@"],
        globals: ["CryptoJS"],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      version: () => {
        const scripts = Array.from(document.querySelectorAll("script[src]"))
        for (const script of scripts) {
          const match = script.src.match(/crypto-js@(\d+\.\d+\.\d+)/)
          if (match) return match[1]
        }
        return null
      },
      weight: 25,
    },

    jQuery: {
      category: "libraries",
      patterns: {
        js: ["jQuery", "$"],
        dom: [],
        scripts: ["jquery.min.js", "jquery.js", "/jquery@"],
        globals: ["jQuery", "$"],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      version: () => window.jQuery?.fn?.jquery || window.$?.fn?.jquery,
      weight: 30,
    },

    // UI FRAMEWORKS
    "Radix UI": {
      category: "ui-frameworks",
      patterns: {
        js: [],
        dom: ["[data-radix-collection-item]", "[data-radix-scroll-area-viewport]", '[role="dialog"]'],
        scripts: ["@radix-ui", "radix-ui"],
        globals: [],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      weight: 30,
    },

    "shadcn/ui": {
      category: "ui-frameworks",
      patterns: {
        js: [],
        dom: [],
        scripts: [],
        globals: [],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [
          "--background:",
          "--foreground:",
          "--card:",
          "--card-foreground:",
          "--popover:",
          "--popover-foreground:",
          "--primary:",
          "--primary-foreground:",
          "--secondary:",
          "--secondary-foreground:",
          "--muted:",
          "--muted-foreground:",
          "--accent:",
          "--accent-foreground:",
          "--destructive:",
          "--destructive-foreground:",
          "--border:",
          "--input:",
          "--ring:",
          "--radius:",
        ],
      },
      customDetection: () => {
        const styles = Array.from(document.querySelectorAll("style"))
        let confidence = 0
        const shadcnPatterns = [
          "--background:",
          "--foreground:",
          "--primary:",
          "--secondary:",
          "--muted:",
          "--accent:",
          "--destructive:",
          "--border:",
          "--input:",
          "--ring:",
          "--radius:",
        ]

        for (const style of styles) {
          const content = style.textContent
          const matches = shadcnPatterns.filter((pattern) => content.includes(pattern))
          if (matches.length >= 5) {
            confidence += 70
            break
          } else if (matches.length >= 3) {
            confidence += 40
          }
        }
        return confidence
      },
      weight: 35,
    },

    Bootstrap: {
      category: "ui-frameworks",
      patterns: {
        js: ["bootstrap"],
        dom: [".container", ".row", ".col-", ".btn", ".navbar"],
        scripts: ["bootstrap.min.js", "bootstrap.js", "/bootstrap@"],
        globals: ["bootstrap"],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: ["bootstrap", ".container", ".row", ".col-"],
      },
      weight: 30,
    },

    // STYLING
    "Tailwind CSS": {
      category: "styling",
      patterns: {
        js: [],
        dom: [],
        scripts: ["tailwindcss", "/tailwindcss@"],
        globals: [],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: ["@tailwind", "tailwindcss"],
      },
      customDetection: () => {
        const elements = document.querySelectorAll("[class]")
        let tailwindClasses = 0
        const tailwindPatterns = [
          /\bbg-\w+(-\d+)?\b/,
          /\btext-\w+(-\d+)?\b/,
          /\bp-\d+\b/,
          /\bm-\d+\b/,
          /\bw-\d+\b/,
          /\bh-\d+\b/,
          /\bflex\b/,
          /\bgrid\b/,
          /\bspace-[xy]-\d+\b/,
          /\bborder-\w+\b/,
          /\brounded(-\w+)?\b/,
          /\bshadow(-\w+)?\b/,
          /\bmax-w-\w+\b/,
          /\bmin-h-\w+\b/,
          /\bjustify-\w+\b/,
          /\bitems-\w+\b/,
        ]

        for (const el of elements) {
          const classes = el.className.split(" ")
          for (const cls of classes) {
            if (tailwindPatterns.some((pattern) => pattern.test(cls))) {
              tailwindClasses++
              if (tailwindClasses >= 10) return 90
            }
          }
        }
        return tailwindClasses >= 7 ? 80 : tailwindClasses >= 4 ? 60 : tailwindClasses >= 2 ? 40 : 0
      },
      weight: 35,
    },

    // ANALYTICS
    "Vercel Analytics": {
      category: "analytics",
      patterns: {
        js: [],
        dom: [],
        scripts: ["@vercel/analytics", "vercel.com/insights"],
        globals: [],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      weight: 35,
    },

    "Google Analytics": {
      category: "analytics",
      patterns: {
        js: ["gtag", "ga", "google_tag_manager"],
        dom: [],
        scripts: ["googletagmanager.com/gtag", "google-analytics.com/analytics.js", "googletagmanager.com/gtm.js"],
        globals: ["gtag", "ga"],
        meta: [],
        headers: {},
        cookies: ["_ga", "_gid", "_gat"],
        html: [],
        css: [],
      },
      customDetection: () => {
        let confidence = 0
        if (window.gtag) confidence += 40
        if (window.ga) confidence += 40
        if (document.cookie.includes("_ga")) confidence += 30
        const scripts = Array.from(document.querySelectorAll("script[src]"))
        if (scripts.some((s) => s.src.includes("googletagmanager.com"))) confidence += 35
        return confidence
      },
      weight: 40,
    },

    "Facebook Pixel": {
      category: "analytics",
      patterns: {
        js: ["fbq"],
        dom: [],
        scripts: ["connect.facebook.net", "fbevents.js"],
        globals: ["fbq"],
        meta: [],
        headers: {},
        cookies: ["_fbp", "_fbc"],
        html: [],
        css: [],
      },
      version: () => {
        const scripts = Array.from(document.querySelectorAll("script[src]"))
        for (const script of scripts) {
          const match = script.src.match(/fbevents\.js\?v=(\d+\.\d+\.\d+)/)
          if (match) return match[1]
        }
        return null
      },
      weight: 35,
    },

    "LinkedIn Insight Tag": {
      category: "analytics",
      patterns: {
        js: ["_linkedin_partner_id"],
        dom: [],
        scripts: ["snap.licdn.com"],
        globals: ["_linkedin_partner_id"],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      weight: 30,
    },

    "Cloudflare Browser Insights": {
      category: "analytics",
      patterns: {
        js: [],
        dom: [],
        scripts: ["cloudflareinsights.com"],
        globals: [],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      weight: 30,
    },

    // TAG MANAGERS
    "Google Tag Manager": {
      category: "tag-managers",
      patterns: {
        js: ["dataLayer", "google_tag_manager"],
        dom: [],
        scripts: ["googletagmanager.com/gtm.js"],
        globals: ["dataLayer"],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      weight: 40,
    },

    // ADVERTISING
    "Microsoft Advertising": {
      category: "advertising",
      patterns: {
        js: ["uetq"],
        dom: [],
        scripts: ["bat.bing.com"],
        globals: ["uetq"],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      weight: 30,
    },

    // CDN
    Cloudflare: {
      category: "cdn",
      patterns: {
        js: [],
        dom: [],
        scripts: ["cdnjs.cloudflare.com"],
        globals: [],
        meta: [],
        headers: { "cf-ray": "", server: "cloudflare" },
        cookies: ["__cfruid"],
        html: [],
        css: [],
      },
      weight: 35,
    },

    cdnjs: {
      category: "cdn",
      patterns: {
        js: [],
        dom: [],
        scripts: ["cdnjs.cloudflare.com"],
        globals: [],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      weight: 30,
    },

    // SECURITY
    HSTS: {
      category: "security",
      patterns: {
        js: [],
        dom: [],
        scripts: [],
        globals: [],
        meta: [],
        headers: { "strict-transport-security": "" },
        cookies: [],
        html: [],
        css: [],
      },
      customDetection: () => {
        return window.location.protocol === "https:" ? 40 : 0
      },
      weight: 20,
    },

    "Cloudflare Bot Management": {
      category: "security",
      patterns: {
        js: [],
        dom: [],
        scripts: ["cf-ray", "cloudflare"],
        globals: [],
        meta: [],
        headers: { "cf-ray": "", "cf-cache-status": "" },
        cookies: ["__cfruid", "__cfuid"],
        html: [],
        css: [],
      },
      weight: 30,
    },

    // PAAS
    Vercel: {
      category: "paas",
      patterns: {
        js: [],
        dom: [],
        scripts: [],
        globals: [],
        meta: [{ name: "generator", content: "Vercel" }],
        headers: { "x-vercel-cache": "", "x-vercel-id": "" },
        cookies: [],
        html: [],
        css: [],
      },
      customDetection: () => {
        const hostname = window.location.hostname
        if (hostname.includes("vercel.app") || hostname.includes("vercel.com")) return 80
        return 0
      },
      weight: 40,
    },

    "Amazon Web Services": {
      category: "paas",
      patterns: {
        js: [],
        dom: [],
        scripts: ["amazonaws.com", "aws-sdk"],
        globals: ["AWS"],
        meta: [],
        headers: { "x-amz-": "", server: "AmazonS3" },
        cookies: [],
        html: [],
        css: [],
      },
      weight: 30,
    },

    // REVERSE PROXIES
    Envoy: {
      category: "reverse-proxies",
      patterns: {
        js: [],
        dom: [],
        scripts: [],
        globals: [],
        meta: [],
        headers: { server: "envoy", "x-envoy-": "" },
        cookies: [],
        html: [],
        css: [],
      },
      weight: 35,
    },

    // CUSTOMER DATA PLATFORM
    Segment: {
      category: "customer-data",
      patterns: {
        js: ["analytics"],
        dom: [],
        scripts: ["segment.com", "cdn.segment.com"],
        globals: ["analytics"],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      weight: 30,
    },

    // PAYMENT PROCESSORS
    Stripe: {
      category: "payment",
      patterns: {
        js: ["Stripe"],
        dom: [],
        scripts: ["js.stripe.com"],
        globals: ["Stripe"],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      weight: 35,
    },

    // LIVE CHAT
    Pusher: {
      category: "live-chat",
      patterns: {
        js: ["Pusher"],
        dom: [],
        scripts: ["js.pusher.com", "pusher.min.js"],
        globals: ["Pusher"],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      weight: 30,
    },

    // EDITORS
    "Monaco Editor": {
      category: "editors",
      patterns: {
        js: ["monaco"],
        dom: ['[class*="monaco"]', '[data-uri*="monaco"]'],
        scripts: ["monaco-editor", "/monaco-editor/"],
        globals: ["monaco"],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [".monaco-editor"],
      },
      weight: 35,
    },

    // ISSUE TRACKERS
    Sentry: {
      category: "issue-trackers",
      patterns: {
        js: ["Sentry", "__SENTRY__"],
        dom: [],
        scripts: ["sentry.io", "@sentry/", "sentry-cdn"],
        globals: ["Sentry", "__SENTRY__"],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      version: () => {
        const scripts = Array.from(document.querySelectorAll("script[src]"))
        for (const script of scripts) {
          const match = script.src.match(/@sentry\/[^@]+@(\d+\.\d+\.\d+)/)
          if (match) return match[1]
        }
        return null
      },
      weight: 35,
    },

    // TOOLS
    Webpack: {
      category: "tools",
      patterns: {
        js: ["__webpack_require__", "webpackJsonp", "__webpack_exports__"],
        dom: [],
        scripts: ["webpack", "/webpack/"],
        globals: ["__webpack_require__", "webpackJsonp"],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      weight: 30,
    },

    // PWA
    PWA: {
      category: "pwa",
      patterns: {
        js: [],
        dom: [],
        scripts: [],
        globals: [],
        meta: [
          { name: "theme-color", content: "" },
          { name: "apple-mobile-web-app-capable", content: "yes" },
        ],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      customDetection: () => {
        let confidence = 0
        if ("serviceWorker" in navigator) {
          navigator.serviceWorker.getRegistrations().then((registrations) => {
            if (registrations.length > 0) confidence += 40
          })
        }
        if (document.querySelector('link[rel="manifest"]')) confidence += 30
        if (document.querySelector('meta[name="theme-color"]')) confidence += 20
        if (document.querySelector('meta[name="apple-mobile-web-app-capable"]')) confidence += 20
        return confidence
      },
      weight: 25,
    },

    // MISC
    "Open Graph": {
      category: "misc",
      patterns: {
        js: [],
        dom: [],
        scripts: [],
        globals: [],
        meta: [
          { property: "og:title", content: "" },
          { property: "og:description", content: "" },
          { property: "og:image", content: "" },
          { property: "og:url", content: "" },
          { property: "og:type", content: "" },
        ],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      customDetection: () => {
        const ogTags = document.querySelectorAll('meta[property^="og:"]')
        return ogTags.length >= 3 ? 100 : ogTags.length >= 2 ? 70 : ogTags.length >= 1 ? 40 : 0
      },
      weight: 20,
    },

    "Priority Hints": {
      category: "performance",
      patterns: {
        js: [],
        dom: ["[fetchpriority]", "[importance]"],
        scripts: [],
        globals: [],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      weight: 25,
    },

    // Add these missing technologies to complete the database:

    Lodash: {
      category: "libraries",
      patterns: {
        js: ["_", "lodash"],
        dom: [],
        scripts: ["lodash.min.js", "lodash.js", "/lodash@"],
        globals: ["_"],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      version: () => window._?.VERSION || window.lodash?.VERSION,
      weight: 25,
    },

    Axios: {
      category: "libraries",
      patterns: {
        js: ["axios"],
        dom: [],
        scripts: ["axios.min.js", "axios.js", "/axios@"],
        globals: ["axios"],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      version: () => window.axios?.VERSION,
      weight: 30,
    },

    "D3.js": {
      category: "libraries",
      patterns: {
        js: ["d3"],
        dom: [],
        scripts: ["d3.min.js", "d3.js", "/d3@"],
        globals: ["d3"],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      version: () => window.d3?.version,
      weight: 30,
    },

    "Three.js": {
      category: "libraries",
      patterns: {
        js: ["THREE"],
        dom: ["canvas"],
        scripts: ["three.min.js", "three.js", "/three@"],
        globals: ["THREE"],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      version: () => window.THREE?.REVISION,
      weight: 35,
    },

    "Chart.js": {
      category: "libraries",
      patterns: {
        js: ["Chart"],
        dom: ["canvas"],
        scripts: ["chart.min.js", "chart.js", "/chart.js@"],
        globals: ["Chart"],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      version: () => window.Chart?.version,
      weight: 30,
    },

    "Moment.js": {
      category: "libraries",
      patterns: {
        js: ["moment"],
        dom: [],
        scripts: ["moment.min.js", "moment.js", "/moment@"],
        globals: ["moment"],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      version: () => window.moment?.version,
      weight: 25,
    },

    // CSS FRAMEWORKS
    "Material-UI": {
      category: "ui-frameworks",
      patterns: {
        js: [],
        dom: [".MuiButton-root", ".MuiTextField-root", "[class*='Mui']"],
        scripts: ["@mui/", "@material-ui/"],
        globals: [],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [".MuiButton", ".MuiTextField", ".Mui"],
      },
      weight: 35,
    },

    "Ant Design": {
      category: "ui-frameworks",
      patterns: {
        js: [],
        dom: [".ant-btn", ".ant-input", "[class*='ant-']"],
        scripts: ["antd", "/antd@"],
        globals: [],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [".ant-", "antd"],
      },
      weight: 35,
    },

    "Chakra UI": {
      category: "ui-frameworks",
      patterns: {
        js: [],
        dom: ["[data-theme]", ".chakra-ui"],
        scripts: ["@chakra-ui/"],
        globals: [],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: ["chakra-ui", ".chakra-"],
      },
      weight: 30,
    },

    Bulma: {
      category: "styling",
      patterns: {
        js: [],
        dom: [".button", ".column", ".container"],
        scripts: ["bulma.min.css", "bulma.css"],
        globals: [],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: ["bulma", ".button", ".column"],
      },
      weight: 30,
    },

    Foundation: {
      category: "styling",
      patterns: {
        js: ["Foundation"],
        dom: [".foundation", ".grid-x", ".cell"],
        scripts: ["foundation.min.js", "foundation.js"],
        globals: ["Foundation"],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: ["foundation", ".grid-x", ".cell"],
      },
      weight: 30,
    },

    // HOSTING & DEPLOYMENT
    Netlify: {
      category: "paas",
      patterns: {
        js: [],
        dom: [],
        scripts: [],
        globals: [],
        meta: [{ name: "generator", content: "Netlify" }],
        headers: { "x-nf-request-id": "", server: "Netlify" },
        cookies: [],
        html: [],
        css: [],
      },
      customDetection: () => {
        const hostname = window.location.hostname
        if (hostname.includes("netlify.app") || hostname.includes("netlify.com")) return 80
        return 0
      },
      weight: 40,
    },

    "GitHub Pages": {
      category: "paas",
      patterns: {
        js: [],
        dom: [],
        scripts: [],
        globals: [],
        meta: [{ name: "generator", content: "GitHub Pages" }],
        headers: { server: "GitHub.com" },
        cookies: [],
        html: [],
        css: [],
      },
      customDetection: () => {
        const hostname = window.location.hostname
        if (hostname.includes("github.io")) return 90
        return 0
      },
      weight: 40,
    },

    Firebase: {
      category: "paas",
      patterns: {
        js: ["firebase"],
        dom: [],
        scripts: ["firebase-app.js", "firebase.js", "/firebase@"],
        globals: ["firebase"],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      weight: 35,
    },

    Heroku: {
      category: "paas",
      patterns: {
        js: [],
        dom: [],
        scripts: [],
        globals: [],
        meta: [],
        headers: { via: "heroku" },
        cookies: [],
        html: [],
        css: [],
      },
      customDetection: () => {
        const hostname = window.location.hostname
        if (hostname.includes("herokuapp.com")) return 90
        return 0
      },
      weight: 40,
    },

    // STATIC SITE GENERATORS
    Gatsby: {
      category: "static-generators",
      patterns: {
        js: ["___gatsby"],
        dom: ["#___gatsby", "[data-gatsby-head]"],
        scripts: ["gatsby-browser.js", "/gatsby/"],
        globals: ["___gatsby"],
        meta: [{ name: "generator", content: "Gatsby" }],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      weight: 40,
    },

    "Nuxt.js": {
      category: "static-generators",
      patterns: {
        js: ["$nuxt", "__NUXT__"],
        dom: ["#__nuxt", "[data-n-head]"],
        scripts: ["/_nuxt/", "nuxt.js"],
        globals: ["$nuxt", "__NUXT__"],
        meta: [{ name: "generator", content: "Nuxt.js" }],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      weight: 40,
    },

    Jekyll: {
      category: "static-generators",
      patterns: {
        js: [],
        dom: [],
        scripts: [],
        globals: [],
        meta: [{ name: "generator", content: "Jekyll" }],
        headers: {},
        cookies: [],
        html: ["<!-- Jekyll -->", "jekyll"],
        css: [],
      },
      weight: 30,
    },

    Hugo: {
      category: "static-generators",
      patterns: {
        js: [],
        dom: [],
        scripts: [],
        globals: [],
        meta: [{ name: "generator", content: "Hugo" }],
        headers: {},
        cookies: [],
        html: ["<!-- Hugo -->", "hugo"],
        css: [],
      },
      weight: 30,
    },

    // WEB SERVERS
    Nginx: {
      category: "web-servers",
      patterns: {
        js: [],
        dom: [],
        scripts: [],
        globals: [],
        meta: [],
        headers: { server: "nginx" },
        cookies: [],
        html: [],
        css: [],
      },
      weight: 30,
    },

    Apache: {
      category: "web-servers",
      patterns: {
        js: [],
        dom: [],
        scripts: [],
        globals: [],
        meta: [],
        headers: { server: "Apache" },
        cookies: [],
        html: [],
        css: [],
      },
      weight: 30,
    },

    // ADDITIONAL ANALYTICS
    Hotjar: {
      category: "analytics",
      patterns: {
        js: ["hj"],
        dom: [],
        scripts: ["hotjar.com", "static.hotjar.com"],
        globals: ["hj"],
        meta: [],
        headers: {},
        cookies: ["_hjid"],
        html: [],
        css: [],
      },
      weight: 35,
    },

    Mixpanel: {
      category: "analytics",
      patterns: {
        js: ["mixpanel"],
        dom: [],
        scripts: ["mixpanel.com", "cdn.mxpnl.com"],
        globals: ["mixpanel"],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      weight: 35,
    },

    Amplitude: {
      category: "analytics",
      patterns: {
        js: ["amplitude"],
        dom: [],
        scripts: ["amplitude.com", "cdn.amplitude.com"],
        globals: ["amplitude"],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      weight: 35,
    },

    // ADDITIONAL PAYMENT
    PayPal: {
      category: "payment",
      patterns: {
        js: ["paypal", "PAYPAL"],
        dom: [],
        scripts: ["paypal.com", "paypalobjects.com"],
        globals: ["paypal", "PAYPAL"],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      weight: 35,
    },

    Square: {
      category: "payment",
      patterns: {
        js: ["Square"],
        dom: [],
        scripts: ["squareup.com", "js.squareup.com"],
        globals: ["Square"],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      weight: 35,
    },

    // ADDITIONAL LIVE CHAT
    Intercom: {
      category: "live-chat",
      patterns: {
        js: ["Intercom"],
        dom: ["#intercom-container"],
        scripts: ["intercom.io", "widget.intercom.io"],
        globals: ["Intercom"],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      weight: 35,
    },

    "Zendesk Chat": {
      category: "live-chat",
      patterns: {
        js: ["$zopim"],
        dom: [],
        scripts: ["zopim.com", "zendesk.com"],
        globals: ["$zopim"],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      weight: 35,
    },

    Crisp: {
      category: "live-chat",
      patterns: {
        js: ["$crisp"],
        dom: [],
        scripts: ["crisp.chat"],
        globals: ["$crisp"],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      weight: 35,
    },

    // ADDITIONAL TOOLS
    Vite: {
      category: "tools",
      patterns: {
        js: [],
        dom: [],
        scripts: ["/@vite/", "vite/dist"],
        globals: [],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      weight: 30,
    },

    Parcel: {
      category: "tools",
      patterns: {
        js: [],
        dom: [],
        scripts: ["/parcel/", "parcel-bundler"],
        globals: [],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      weight: 30,
    },

    Rollup: {
      category: "tools",
      patterns: {
        js: [],
        dom: [],
        scripts: ["rollup", "/rollup/"],
        globals: [],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      weight: 30,
    },

    // ADDITIONAL MISC
    "Twitter Cards": {
      category: "misc",
      patterns: {
        js: [],
        dom: [],
        scripts: [],
        globals: [],
        meta: [
          { name: "twitter:card", content: "" },
          { name: "twitter:site", content: "" },
          { name: "twitter:title", content: "" },
        ],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      customDetection: () => {
        const twitterTags = document.querySelectorAll('meta[name^="twitter:"]')
        return twitterTags.length >= 2 ? 90 : twitterTags.length >= 1 ? 60 : 0
      },
      weight: 20,
    },

    "Schema.org": {
      category: "misc",
      patterns: {
        js: [],
        dom: ["[itemscope]", "[itemtype]", "[itemprop]"],
        scripts: [],
        globals: [],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      customDetection: () => {
        const schemaElements = document.querySelectorAll("[itemscope], [itemtype], [itemprop]")
        const jsonLd = document.querySelectorAll('script[type="application/ld+json"]')
        return schemaElements.length > 0 || jsonLd.length > 0 ? 80 : 0
      },
      weight: 25,
    },

    AMP: {
      category: "performance",
      patterns: {
        js: [],
        dom: ["amp-", "[amp]"],
        scripts: ["ampproject.org", "cdn.ampproject.org"],
        globals: [],
        meta: [],
        headers: {},
        cookies: [],
        html: ["⚡", "amp"],
        css: [],
      },
      customDetection: () => {
        const html = document.documentElement
        return html.hasAttribute("amp") || html.hasAttribute("⚡") ? 100 : 0
      },
      weight: 40,
    },

    "Service Worker": {
      category: "pwa",
      patterns: {
        js: [],
        dom: [],
        scripts: ["sw.js", "service-worker.js", "serviceworker.js"],
        globals: [],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      customDetection: () => {
        if ("serviceWorker" in navigator) {
          return 60
        }
        return 0
      },
      weight: 30,
    },

    "Web App Manifest": {
      category: "pwa",
      patterns: {
        js: [],
        dom: [],
        scripts: [],
        globals: [],
        meta: [],
        headers: {},
        cookies: [],
        html: [],
        css: [],
      },
      customDetection: () => {
        return document.querySelector('link[rel="manifest"]') ? 80 : 0
      },
      weight: 30,
    },
  }

  // Original detection engine (UNCHANGED EXCEPT FOR REACT)
  function detectTechnology(name, signature) {
    let confidence = 0
    let version = null
    const checks = []

    try {
      // Custom detection logic (highest priority)
      if (signature.customDetection) {
        const customConfidence = signature.customDetection()
        if (customConfidence > 0) {
          confidence += customConfidence
          checks.push(`Custom: ${customConfidence}%`)
        }
      }

      // JavaScript globals
      if (signature.patterns.js.length > 0) {
        for (const jsPattern of signature.patterns.js) {
          if (window[jsPattern]) {
            confidence += signature.weight || 30
            checks.push(`JS: ${jsPattern}`)
          }
        }
      }

      // DOM elements
      if (signature.patterns.dom.length > 0) {
        for (const domPattern of signature.patterns.dom) {
          if (document.querySelector(domPattern)) {
            confidence += signature.weight || 25
            checks.push(`DOM: ${domPattern}`)
          }
        }
      }

      // Script sources
      if (signature.patterns.scripts.length > 0) {
        const scripts = Array.from(document.querySelectorAll("script[src]"))
        for (const scriptPattern of signature.patterns.scripts) {
          if (scripts.some((script) => script.src.includes(scriptPattern))) {
            confidence += signature.weight || 35
            checks.push(`Script: ${scriptPattern}`)
          }
        }
      }

      // Globals
      if (signature.patterns.globals.length > 0) {
        for (const globalPattern of signature.patterns.globals) {
          if (window[globalPattern]) {
            confidence += signature.weight || 30
            checks.push(`Global: ${globalPattern}`)
          }
        }
      }

      // Meta tags
      if (signature.patterns.meta.length > 0) {
        for (const metaPattern of signature.patterns.meta) {
          let meta
          if (metaPattern.name) {
            meta = document.querySelector(`meta[name="${metaPattern.name}"]`)
            if (meta && (metaPattern.content === "" || meta.content.includes(metaPattern.content))) {
              confidence += 40
              checks.push(`Meta: ${metaPattern.name}`)
            }
          } else if (metaPattern.property) {
            meta = document.querySelector(`meta[property="${metaPattern.property}"]`)
            if (meta) {
              confidence += 30
              checks.push(`Meta: ${metaPattern.property}`)
            }
          }
        }
      }

      // CSS detection
      if (signature.patterns.css.length > 0) {
        const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
        const styles = Array.from(document.querySelectorAll("style"))

        for (const cssPattern of signature.patterns.css) {
          if (stylesheets.some((link) => link.href.includes(cssPattern))) {
            confidence += 35
            checks.push(`CSS Link: ${cssPattern}`)
          }

          if (styles.some((style) => style.textContent.includes(cssPattern))) {
            confidence += 25
            checks.push(`CSS Inline: ${cssPattern}`)
          }
        }
      }

      // Cookies
      if (signature.patterns.cookies.length > 0) {
        const cookies = document.cookie
        for (const cookiePattern of signature.patterns.cookies) {
          if (cookies.includes(cookiePattern)) {
            confidence += 30
            checks.push(`Cookie: ${cookiePattern}`)
          }
        }
      }

      // Get version if available
      if (signature.version && typeof signature.version === "function") {
        try {
          version = signature.version()
        } catch (e) {
          // Version detection failed
        }
      }

      return {
        detected: confidence >= 25, // ORIGINAL THRESHOLD
        confidence: Math.min(confidence, 100),
        version,
        checks,
      }
    } catch (error) {
      console.error(`Error detecting ${name}:`, error)
      return { detected: false, confidence: 0, version: null, checks: [] }
    }
  }

  // Run detection for all technologies
  const results = {}

  for (const [techName, signature] of Object.entries(techSignatures)) {
    const detection = detectTechnology(techName, signature)
    if (detection.detected) {
      results[techName] = {
        category: signature.category,
        confidence: detection.confidence,
        version: detection.version,
        checks: detection.checks,
      }
    }
  }

  // Organize results by category
  for (const [techName, result] of Object.entries(results)) {
    const tech = {
      name: techName,
      class: techName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      confidence: Math.round(result.confidence),
      version: result.version,
    }

    if (detectedTechs[result.category]) {
      detectedTechs[result.category].push(tech)
    }
  }

  // Sort by confidence within each category
  for (const category of Object.keys(detectedTechs)) {
    detectedTechs[category].sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
  }

  // Send results back to popup
  chrome.runtime.sendMessage({
    type: "TECHS_DETECTED",
    techs: detectedTechs,
  })
}

// Initialize the detector
new TechDetector()

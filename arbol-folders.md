📦appweb-base
 ┣ 📂.github
 ┃ ┣ 📂actions
 ┃ ┃ ┗ 📂setup-project
 ┃ ┃ ┃ ┗ 📜action.yml
 ┃ ┣ 📂workflows
 ┃ ┃ ┣ 📜checkly.yml
 ┃ ┃ ┣ 📜CI.yml
 ┃ ┃ ┣ 📜crowdin.yml
 ┃ ┃ ┗ 📜release.yml
 ┃ ┣ 📜dependabot.yml
 ┃ ┗ 📜FUNDING.yml
 ┣ 📂.storybook
 ┃ ┣ 📜main.ts
 ┃ ┣ 📜preview.ts
 ┃ ┣ 📜vitest.config.mts
 ┃ ┗ 📜vitest.setup.ts
 ┣ 📂.vscode
 ┃ ┣ 📜c_cpp_properties.json
 ┃ ┣ 📜extensions.json
 ┃ ┣ 📜launch.json
 ┃ ┣ 📜settings.json
 ┃ ┗ 📜tasks.json
 ┣ 📂migrations
 ┃ ┣ 📂meta
 ┃ ┃ ┣ 📜0000_snapshot.json
 ┃ ┃ ┗ 📜_journal.json
 ┃ ┗ 📜0000_init-db.sql
 ┣ 📂public
 ┃ ┣ 📂assets
 ┃ ┃ ┗ 📂images
 ┃ ┃ ┃ ┣ 📜arcjet-dark.svg
 ┃ ┃ ┃ ┣ 📜arcjet-light.svg
 ┃ ┃ ┃ ┣ 📜better-stack-dark.png
 ┃ ┃ ┃ ┣ 📜better-stack-white.png
 ┃ ┃ ┃ ┣ 📜checkly-logo-dark.png
 ┃ ┃ ┃ ┣ 📜checkly-logo-light.png
 ┃ ┃ ┃ ┣ 📜clerk-logo-dark.png
 ┃ ┃ ┃ ┣ 📜coderabbit-logo-dark.svg
 ┃ ┃ ┃ ┣ 📜coderabbit-logo-light.svg
 ┃ ┃ ┃ ┣ 📜crowdin-dark.png
 ┃ ┃ ┃ ┣ 📜crowdin-white.png
 ┃ ┃ ┃ ┣ 📜nextjs-boilerplate-saas.png
 ┃ ┃ ┃ ┣ 📜nextjs-boilerplate-sign-in.png
 ┃ ┃ ┃ ┣ 📜nextjs-boilerplate-sign-up.png
 ┃ ┃ ┃ ┣ 📜nextjs-starter-banner.png
 ┃ ┃ ┃ ┣ 📜posthog-logo.svg
 ┃ ┃ ┃ ┣ 📜sentry-dark.png
 ┃ ┃ ┃ ┗ 📜sentry-white.png
 ┃ ┣ 📜apple-touch-icon.png
 ┃ ┣ 📜favicon-16x16.png
 ┃ ┣ 📜favicon-32x32.png
 ┃ ┗ 📜favicon.ico
 ┣ 📂src
 ┃ ┣ 📂app
 ┃ ┃ ┣ 📂[locale]
 ┃ ┃ ┃ ┣ 📂(auth)
 ┃ ┃ ┃ ┃ ┣ 📂(center)
 ┃ ┃ ┃ ┃ ┃ ┣ 📂sign-in
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂[[...sign-in]]
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┃ ┃ ┣ 📂sign-up
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂[[...sign-up]]
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┃ ┃ ┗ 📜layout.tsx
 ┃ ┃ ┃ ┃ ┣ 📂dashboard
 ┃ ┃ ┃ ┃ ┃ ┣ 📂properties
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂new
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂[id]
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂edit
 ┃ ┃ ┃ ┃ ┃ ┣ 📂user-profile
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂[[...user-profile]]
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┃ ┃ ┣ 📜layout.tsx
 ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┃ ┗ 📜layout.tsx
 ┃ ┃ ┃ ┣ 📂(immersive)
 ┃ ┃ ┃ ┃ ┗ 📂solar-system
 ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┣ 📂(marketing)
 ┃ ┃ ┃ ┃ ┣ 📂about
 ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┃ ┣ 📂counter
 ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┃ ┣ 📂portfolio
 ┃ ┃ ┃ ┃ ┃ ┣ 📂[slug]
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┃ ┣ 📂solar-system
 ┃ ┃ ┃ ┃ ┣ 📜layout.tsx
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┣ 📂api
 ┃ ┃ ┃ ┃ ┗ 📂counter
 ┃ ┃ ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┃ ┃ ┗ 📜layout.tsx
 ┃ ┃ ┣ 📜global-error.tsx
 ┃ ┃ ┣ 📜robots.ts
 ┃ ┃ ┗ 📜sitemap.ts
 ┃ ┣ 📂components
 ┃ ┃ ┣ 📜CounterForm.tsx
 ┃ ┃ ┣ 📜CurrentCount.tsx
 ┃ ┃ ┣ 📜DemoBadge.tsx
 ┃ ┃ ┣ 📜DemoBanner.tsx
 ┃ ┃ ┣ 📜Hello.tsx
 ┃ ┃ ┣ 📜LocaleSwitcher.tsx
 ┃ ┃ ┣ 📜SolarSystemExperience.tsx
 ┃ ┃ ┗ 📜Sponsors.tsx
 ┃ ┣ 📂features
 ┃ ┃ ┗ 📂casero
 ┃ ┃ ┃ ┣ 📂components
 ┃ ┃ ┃ ┗ 📂ui
 ┃ ┣ 📂libs
 ┃ ┃ ┣ 📜Arcjet.ts
 ┃ ┃ ┣ 📜DB.ts
 ┃ ┃ ┣ 📜Env.ts
 ┃ ┃ ┣ 📜I18n.ts
 ┃ ┃ ┣ 📜I18nNavigation.ts
 ┃ ┃ ┣ 📜I18nRouting.ts
 ┃ ┃ ┗ 📜Logger.ts
 ┃ ┣ 📂locales
 ┃ ┃ ┣ 📜en.json
 ┃ ┃ ┗ 📜es.json
 ┃ ┣ 📂models
 ┃ ┃ ┗ 📜Schema.ts
 ┃ ┣ 📂styles
 ┃ ┃ ┗ 📜global.css
 ┃ ┣ 📂templates
 ┃ ┃ ┣ 📜BaseTemplate.stories.tsx
 ┃ ┃ ┣ 📜BaseTemplate.test.tsx
 ┃ ┃ ┗ 📜BaseTemplate.tsx
 ┃ ┣ 📂types
 ┃ ┃ ┗ 📜I18n.ts
 ┃ ┣ 📂utils
 ┃ ┃ ┣ 📜AppConfig.ts
 ┃ ┃ ┣ 📜DBConnection.ts
 ┃ ┃ ┣ 📜Helpers.test.ts
 ┃ ┃ ┗ 📜Helpers.ts
 ┃ ┣ 📂validations
 ┃ ┃ ┗ 📜CounterValidation.ts
 ┃ ┣ 📜instrumentation-client.ts
 ┃ ┣ 📜instrumentation.ts
 ┃ ┗ 📜proxy.ts
 ┣ 📂tests
 ┃ ┣ 📂e2e
 ┃ ┃ ┣ 📜Counter.e2e.ts
 ┃ ┃ ┣ 📜I18n.e2e.ts
 ┃ ┃ ┣ 📜Sanity.check.e2e.ts
 ┃ ┃ ┗ 📜Visual.e2e.ts
 ┃ ┗ 📂integration
 ┃ ┃ ┗ 📜Counter.spec.ts
 ┣ 📜.coderabbit.yaml
 ┣ 📜.env
 ┣ 📜.env.production
 ┣ 📜.gitignore
 ┣ 📜.next-dev.err.log
 ┣ 📜.next-dev.log
 ┣ 📜AGENTS.md
 ┣ 📜arbol-folders.md
 ┣ 📜checkly.config.ts
 ┣ 📜CLAUDE.md
 ┣ 📜codecov.yml
 ┣ 📜commitlint.config.ts
 ┣ 📜crowdin.yml
 ┣ 📜drizzle.config.ts
 ┣ 📜herramientas-proyecto.md
 ┣ 📜knip.config.ts
 ┣ 📜lefthook.yml
 ┣ 📜LICENSE
 ┣ 📜next-env.d.ts
 ┣ 📜next.config.ts
 ┣ 📜oxfmt.config.ts
 ┣ 📜oxlint.config.ts
 ┣ 📜package-lock.json
 ┣ 📜package.json
 ┣ 📜playwright.config.ts
 ┣ 📜README.md
 ┣ 📜skills-lock.json
 ┣ 📜tsconfig.json
 ┣ 📜tsconfig.tsbuildinfo
 ┗ 📜vitest.config.ts

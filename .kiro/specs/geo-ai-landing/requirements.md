# Requirements Document

## Introduction

Современный анимированный landing-сайт для open-source dev-tool проекта GEO AI. Сайт объясняет концепцию AI Search Optimization (GEO) и направляет пользователей к ключевым ресурсам: GitHub-репозиториям, онлайн-анализатору, npm-пакетам, WordPress-плагину и Shopify-приложению. Визуальный стиль вдохновлён чистым, минималистичным дизайном с акцентом на типографику, whitespace и абстрактные геометрические/dot-pattern иллюстрации. Основная тема — светлая (белый/светло-серый фон), с поддержкой dark mode. Эстетика premium SaaS/dev-tool с утончёнными анимациями.

Проект построен на Next.js 16, Tailwind CSS 4, React 19. Для UI-компонентов используется Shadcn UI, для иконок — Lucide, для анимаций — Framer Motion, Canvas/SVG.

## Glossary

- **Landing_Page**: Сайт GEO AI, состоящий из последовательных секций (Hero, Platform Ecosystem, How it Works, Analyzer, Developer Quick Start, GEO Specification, Open Source, Footer)
- **Hero_Section**: Полноэкранная вводная секция с белым/светлым фоном, абстрактным dot-pattern фоном (карта мира из точек), центрированным контентом, навигационной панелью и баром логотипов AI-систем
- **Platform_Ecosystem_Section**: Секция с тремя карточками продуктов экосистемы GEO AI (Core, Woo, Shopify) с абстрактными геометрическими SVG/Canvas иллюстрациями
- **How_It_Works_Section**: Секция с четырьмя шагами процесса работы GEO AI, соединёнными анимированными линиями
- **Analyzer_Section**: Интерактивная секция с формой ввода URL и демонстрацией результатов анализа AI-видимости
- **Quick_Start_Section**: Секция с блоком кода для быстрого старта разработчика (npm install, пример использования)
- **Specification_Section**: Секция, объясняющая структурированные сигналы для AI-поисковых систем
- **Open_Source_Section**: Секция со ссылками на все open-source репозитории и npm-пакеты
- **Footer**: Минимальный футер со ссылками на ключевые ресурсы
- **Navigation_Bar**: Верхняя навигационная панель с логотипом, ссылками и кнопкой Sign in
- **Animation_System**: Система анимаций на базе Framer Motion, включающая subtle dot-pattern motion, scroll reveal, hover эффекты — утончённые и ненавязчивые
- **Theme_System**: Система переключения между light (по умолчанию) и dark mode
- **Dot_Pattern_Background**: Абстрактный фон из точек/ASCII-паттернов, формирующий карту мира или геометрические фигуры
- **Geometric_Illustrations**: Абстрактные геометрические SVG/Canvas иллюстрации (3D-кольца, радиальные точечные паттерны, параллельные линии) для карточек
- **AI_Logos_Bar**: Горизонтальная полоса с логотипами поддерживаемых AI-систем в нижней части Hero_Section
- **Scroll_Reveal**: Анимация появления элементов при прокрутке страницы с использованием Intersection Observer
- **Analyzer_Tool**: Страница /analyze, на которую ведёт CTA из Analyzer_Section

## Requirements

### Requirement 1: Общая структура и навигация Landing Page

**User Story:** Как посетитель сайта, я хочу видеть структурированную одностраничную landing page с последовательными секциями, чтобы легко ознакомиться с продуктом GEO AI.

#### Acceptance Criteria

1. THE Landing_Page SHALL отображать секции в следующем порядке: Hero_Section, Platform_Ecosystem_Section, How_It_Works_Section, Analyzer_Section, Quick_Start_Section, Specification_Section, Open_Source_Section, Footer
2. THE Landing_Page SHALL использовать шрифт Geist Sans для основного текста и Geist Mono для блоков кода
3. THE Landing_Page SHALL корректно отображаться на экранах шириной от 320px до 2560px
4. THE Landing_Page SHALL обеспечивать плавную прокрутку между секциями
5. THE Landing_Page SHALL использовать светлый фон (белый/светло-серый) как основную визуальную тему по умолчанию
6. THE Landing_Page SHALL обеспечивать обильное использование whitespace между секциями и элементами для чистого минималистичного вида

### Requirement 2: Система тем (Light/Dark Mode)

**User Story:** Как посетитель сайта, я хочу видеть сайт в предпочитаемой мной цветовой схеме, чтобы комфортно просматривать контент.

#### Acceptance Criteria

1. THE Theme_System SHALL использовать светлую тему как тему по умолчанию
2. THE Theme_System SHALL определять системную цветовую схему пользователя через CSS media query prefers-color-scheme
3. WHILE светлая тема активна, THE Landing_Page SHALL использовать белый фон (#ffffff) для основных секций, светло-серый (#f8f9fa) для карточек и тёмный текст (#0a0a0a)
4. WHILE тёмная тема активна, THE Landing_Page SHALL использовать тёмный фон (#0a0a0a) и светлый текст (#ffffff)
5. THE Theme_System SHALL обеспечивать плавный переход цветов при смене темы

### Requirement 3: Navigation Bar

**User Story:** Как посетитель сайта, я хочу видеть навигационную панель вверху страницы, чтобы быстро перемещаться по разделам и ресурсам.

#### Acceptance Criteria

1. THE Navigation_Bar SHALL отображаться в верхней части Landing_Page поверх Hero_Section
2. THE Navigation_Bar SHALL содержать логотип GEO AI слева
3. THE Navigation_Bar SHALL содержать навигационные ссылки: Analyzer, GitHub, Documentation, Specification
4. THE Navigation_Bar SHALL содержать кнопку "Sign in" справа
5. THE Navigation_Bar SHALL использовать чистый минималистичный стиль с прозрачным или белым фоном
6. WHILE пользователь прокручивает страницу вниз, THE Navigation_Bar SHALL оставаться фиксированной вверху viewport

### Requirement 4: Hero Section

**User Story:** Как посетитель сайта, я хочу видеть впечатляющую Hero-секцию с чистым дизайном и абстрактными визуальными элементами, чтобы сразу понять суть продукта GEO AI.

#### Acceptance Criteria

1. THE Hero_Section SHALL занимать полную высоту viewport (100vh)
2. THE Hero_Section SHALL отображать белый/светлый фон как основной стиль по умолчанию
3. THE Hero_Section SHALL отображать абстрактный Dot_Pattern_Background — паттерн из точек, формирующий карту мира или абстрактную геометрическую фигуру, как subtle фоновый элемент
4. THE Hero_Section SHALL отображать центрированный контент с чёткой типографической иерархией
5. THE Hero_Section SHALL отображать надзаголовок "Open-source AI Search Optimization" мелким текстом над основным заголовком
6. THE Hero_Section SHALL отображать основной заголовок "GEO AI" крупным display/serif шрифтом с анимацией fade-in
7. THE Hero_Section SHALL отображать подзаголовок "Generate llms.txt, AI crawler rules and metadata to make your site visible to AI search engines."
8. THE Hero_Section SHALL отображать одну основную CTA-кнопку "Run Analyzer" (ссылка на /analyze) с subtle gradient/holographic эффектом
9. THE Hero_Section SHALL отображать вторичную текстовую ссылку "View on GitHub" (ссылка на https://github.com/madeburo/GEO-AI)
10. THE AI_Logos_Bar SHALL отображаться в нижней части Hero_Section как горизонтальная полоса с логотипами/названиями поддерживаемых AI-систем: ChatGPT, Claude, Gemini, Perplexity, Grok, Qwen
11. THE AI_Logos_Bar SHALL использовать приглушённые серые тона для логотипов, чтобы не отвлекать от основного контента
12. WHEN страница загружена, THE Animation_System SHALL запустить subtle анимацию dot-pattern, fade-in заголовка и slide-up контента

### Requirement 5: Platform Ecosystem Section

**User Story:** Как посетитель сайта, я хочу видеть обзор экосистемы продуктов GEO AI с чистыми карточками и абстрактными иллюстрациями, чтобы выбрать подходящий инструмент для моей платформы.

#### Acceptance Criteria

1. THE Platform_Ecosystem_Section SHALL отображать крупный заголовок секции слева и описание справа в grid-layout
2. THE Platform_Ecosystem_Section SHALL отображать три карточки продуктов в ряд: GEO AI Core (TypeScript engine, ссылка: https://github.com/madeburo/GEO-AI), GEO AI Woo (WordPress & WooCommerce, ссылка: https://github.com/madeburo/GEO-AI-Woo), GEO AI Shopify (Shopify stores, ссылка: https://github.com/madeburo/GEO-AI-Shopify)
3. THE Platform_Ecosystem_Section SHALL отображать уникальную абстрактную Geometric_Illustrations на каждой карточке: 3D-кольца для Core, радиальный точечный паттерн для Woo, параллельные линии для Shopify
4. THE Platform_Ecosystem_Section SHALL отображать карточки со светло-серым фоном (#f5f5f5 / #f8f9fa), без тяжёлых бордеров, с обильным внутренним padding
5. THE Platform_Ecosystem_Section SHALL отображать на каждой карточке: Geometric_Illustrations вверху, жирный заголовок продукта, краткое описание и ссылку "Read more →"
6. WHEN пользователь наводит курсор на карточку, THE Animation_System SHALL применить subtle hover эффект (лёгкое поднятие тени, без glow и gradient shift)
7. WHEN Platform_Ecosystem_Section попадает в viewport, THE Scroll_Reveal SHALL анимировать появление карточек
8. THE Platform_Ecosystem_Section SHALL использовать обильный whitespace между карточками и вокруг секции

### Requirement 6: How It Works Section

**User Story:** Как посетитель сайта, я хочу понять процесс работы GEO AI по шагам, чтобы оценить простоту интеграции.

#### Acceptance Criteria

1. THE How_It_Works_Section SHALL отображать четыре шага с иконками: "Generate llms.txt", "Configure AI crawler rules", "Add AI metadata", "Provide structured signals"
2. THE How_It_Works_Section SHALL отображать subtle connection lines между шагами
3. THE How_It_Works_Section SHALL использовать чистый минималистичный layout с whitespace
4. WHEN How_It_Works_Section попадает в viewport, THE Scroll_Reveal SHALL анимировать последовательное появление шагов

### Requirement 7: Analyzer Section

**User Story:** Как посетитель сайта, я хочу увидеть интерактивную демонстрацию анализатора AI-видимости, чтобы понять ценность инструмента.

#### Acceptance Criteria

1. THE Analyzer_Section SHALL отображать заголовок "Check your AI search visibility"
2. THE Analyzer_Section SHALL отображать поле ввода URL с placeholder "Enter your website URL" и кнопку "Analyze site"
3. THE Analyzer_Section SHALL отображать пример результатов анализа: AI Visibility Score 72, список пройденных проверок (llms.txt detected, AI metadata present, structured schema) и список отсутствующих элементов (crawler rules missing, AI summary missing)
4. THE Analyzer_Section SHALL отображать анимированный score gauge и progress bars для визуализации результатов
5. THE Analyzer_Section SHALL отображать кнопку "Fix with GEO AI"
6. WHEN Analyzer_Section попадает в viewport, THE Animation_System SHALL анимировать заполнение score gauge и progress bars

### Requirement 8: Developer Quick Start Section

**User Story:** Как разработчик, я хочу видеть пример быстрого старта с кодом, чтобы сразу начать использовать GEO AI.

#### Acceptance Criteria

1. THE Quick_Start_Section SHALL отображать блок кода с командой установки: npm install geo-ai-core
2. THE Quick_Start_Section SHALL отображать блок кода с примером использования createGeoAI
3. THE Quick_Start_Section SHALL применять syntax highlighting к блокам кода
4. THE Quick_Start_Section SHALL отображать кнопку копирования кода в буфер обмена
5. WHEN пользователь нажимает кнопку копирования, THE Quick_Start_Section SHALL скопировать содержимое блока кода в буфер обмена

### Requirement 9: GEO Specification Section

**User Story:** Как посетитель сайта, я хочу узнать о структурированных сигналах для AI-поисковых систем, чтобы понять техническую основу GEO.

#### Acceptance Criteria

1. THE Specification_Section SHALL описывать концепцию структурированных сигналов для AI-поисковых систем
2. THE Specification_Section SHALL отображать четыре элемента: llms.txt, AI metadata, crawler rules, structured signals
3. THE Specification_Section SHALL содержать ссылку на страницу спецификации
4. WHEN Specification_Section попадает в viewport, THE Scroll_Reveal SHALL анимировать появление элементов

### Requirement 10: Open Source Section

**User Story:** Как разработчик, я хочу видеть ссылки на все open-source репозитории и пакеты, чтобы быстро перейти к нужному ресурсу.

#### Acceptance Criteria

1. THE Open_Source_Section SHALL отображать ссылки на репозитории: GEO AI Core, GEO AI Woo, GEO AI Shopify, npm package
2. THE Open_Source_Section SHALL отображать количество GitHub stars и npm downloads
3. WHEN Open_Source_Section попадает в viewport, THE Scroll_Reveal SHALL анимировать появление элементов

### Requirement 11: Footer

**User Story:** Как посетитель сайта, я хочу видеть минимальный футер с ключевыми ссылками, чтобы быстро найти нужный ресурс.

#### Acceptance Criteria

1. THE Footer SHALL отображать название "GEO AI" и подпись "AI Search Optimization"
2. THE Footer SHALL отображать ссылки: Analyzer (/analyze), GitHub (https://github.com/madeburo/GEO-AI), Documentation, Specification
3. THE Footer SHALL отображать домен geoai.run

### Requirement 12: Система анимаций

**User Story:** Как посетитель сайта, я хочу видеть утончённые и ненавязчивые анимации, чтобы получить premium-ощущение от сайта без визуального шума.

#### Acceptance Criteria

1. THE Animation_System SHALL использовать Framer Motion для subtle fade-in, slide-up, scroll reveal анимаций
2. THE Animation_System SHALL использовать GPU-ускоренные CSS-свойства (transform, opacity) для всех анимаций
3. THE Animation_System SHALL использовать Intersection Observer для запуска scroll reveal анимаций
4. THE Animation_System SHALL обеспечивать утончённые, refined анимации — без flashy эффектов, glow-линий и тяжёлых gradient transitions
5. THE Dot_Pattern_Background SHALL рендерить абстрактный dot-pattern на Canvas/SVG элементе с subtle медленным движением
6. IF устройство пользователя имеет prefers-reduced-motion: reduce, THEN THE Animation_System SHALL отключить или минимизировать анимации

### Requirement 13: SEO и метаданные

**User Story:** Как владелец продукта, я хочу чтобы сайт имел корректные SEO-метаданные, чтобы обеспечить видимость в поисковых системах.

#### Acceptance Criteria

1. THE Landing_Page SHALL содержать meta title "GEO AI — AI Search Optimization"
2. THE Landing_Page SHALL содержать meta description "Open-source AI Search Optimization for websites and ecommerce."
3. THE Landing_Page SHALL использовать семантическую HTML-разметку (header, nav, main, section, footer)
4. THE Landing_Page SHALL содержать Open Graph теги для корректного отображения при шаринге

### Requirement 14: Страница Analyzer

**User Story:** Как посетитель сайта, я хочу перейти на отдельную страницу анализатора по CTA-кнопке, чтобы проанализировать свой сайт.

#### Acceptance Criteria

1. WHEN пользователь переходит по маршруту /analyze, THE Analyzer_Tool SHALL отображать страницу анализатора
2. THE Analyzer_Tool SHALL содержать поле ввода URL и кнопку запуска анализа
3. THE Analyzer_Tool SHALL использовать тот же визуальный стиль, что и Landing_Page

### Requirement 15: Визуальные элементы и иллюстрации

**User Story:** Как посетитель сайта, я хочу видеть современные абстрактные визуальные элементы, чтобы сайт выглядел как premium dev-tool продукт с чистым минималистичным дизайном.

#### Acceptance Criteria

1. THE Landing_Page SHALL использовать абстрактные dot-patterns как основной декоративный элемент фона (вместо тяжёлых градиентов и glowing lines)
2. THE Hero_Section SHALL отображать dot-pattern/ASCII-art фон, формирующий абстрактную карту мира или геометрическую фигуру из точек
3. THE Platform_Ecosystem_Section SHALL отображать уникальные абстрактные Geometric_Illustrations на каждой карточке, реализованные через SVG или Canvas (3D-кольца, радиальные точечные burst-паттерны, параллельные линии)
4. THE Landing_Page SHALL использовать чистые grid-layouts с обильным whitespace для разделения контента
5. THE Landing_Page SHALL использовать subtle soft gradients только для переходов между секциями, без ярких и flashy gradient эффектов
6. THE Landing_Page SHALL использовать типографику как основной инструмент визуальной иерархии — крупные display заголовки, чёткая иерархия размеров текста
7. THE Geometric_Illustrations SHALL использовать монохромную или приглушённую цветовую палитру, согласованную с общим минималистичным стилем

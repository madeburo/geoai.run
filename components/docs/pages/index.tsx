import { type TocItem } from "@/components/docs/doc-toc";
import { GettingStartedPage } from "./getting-started";
import { ChoosePackagePage } from "./choose-package";
import { SpecificationPage } from "./specification";
import { LlmsTxtPage } from "./llms-txt";
import { AiMetadataPage } from "./ai-metadata";
import { CrawlerRulesPage } from "./crawler-rules";
import { StructuredSignalsPage } from "./structured-signals";
import { CorePackagePage } from "./core-package";
import { NextPackagePage } from "./next-package";
import { WooPackagePage } from "./woo-package";
import { ShopifyPackagePage } from "./shopify-package";
import { AnalyzerPage } from "./analyzer";
import { AnalyzerScoringPage } from "./analyzer-scoring";
import { AnalyzerRecommendationsPage } from "./analyzer-recommendations";
import { CliPage } from "./cli";
import { NestJsPage } from "./nestjs";
import { LaravelPage } from "./laravel";
import { ConfigReferencePage } from "./config-reference";
import { ApiReferencePage } from "./api-reference";
import { FaqPage } from "./faq";

const PAGE_MAP: Record<string, { content: React.ReactNode; toc: TocItem[] }> = {
  "getting-started": GettingStartedPage,
  "getting-started/choose": ChoosePackagePage,
  "specification": SpecificationPage,
  "concepts/llms-txt": LlmsTxtPage,
  "concepts/ai-metadata": AiMetadataPage,
  "concepts/crawler-rules": CrawlerRulesPage,
  "concepts/structured-signals": StructuredSignalsPage,
  "packages/core": CorePackagePage,
  "packages/next": NextPackagePage,
  "packages/woo": WooPackagePage,
  "packages/shopify": ShopifyPackagePage,
  "analyzer": AnalyzerPage,
  "analyzer/scoring": AnalyzerScoringPage,
  "analyzer/recommendations": AnalyzerRecommendationsPage,
  "integrations/cli": CliPage,
  "integrations/nestjs": NestJsPage,
  "integrations/laravel": LaravelPage,
  "reference/configuration": ConfigReferencePage,
  "reference/api": ApiReferencePage,
  "faq": FaqPage,
};

export function renderDocPage(contentKey: string): { content: React.ReactNode; toc: TocItem[] } {
  return PAGE_MAP[contentKey] ?? { content: null, toc: [] };
}

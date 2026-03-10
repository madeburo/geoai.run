import { type TocItem } from "@/components/docs/doc-toc";
import { GettingStartedPage } from "./getting-started";
import { ChoosePackagePage } from "./choose-package";
import { SpecificationOverviewPage } from "./specification-overview";
import { SpecLlmsTxtPage } from "./spec-llms-txt";
import { SpecAiMetadataPage } from "./spec-ai-metadata";
import { SpecCrawlerRulesPage } from "./spec-crawler-rules";
import { SpecStructuredSignalsPage } from "./spec-structured-signals";
import { SpecScoringPage } from "./spec-scoring";
import { SpecRecommendationsPage } from "./spec-recommendations";
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
  "specification": SpecificationOverviewPage,
  "specification/llms-txt": SpecLlmsTxtPage,
  "specification/ai-metadata": SpecAiMetadataPage,
  "specification/crawler-rules": SpecCrawlerRulesPage,
  "specification/structured-signals": SpecStructuredSignalsPage,
  "specification/scoring": SpecScoringPage,
  "specification/recommendations": SpecRecommendationsPage,
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

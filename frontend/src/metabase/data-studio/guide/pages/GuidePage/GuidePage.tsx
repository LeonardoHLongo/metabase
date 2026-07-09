import { jt, t } from "ttag";

import { DataStudioBreadcrumbs } from "metabase/common/data-studio/components/DataStudioBreadcrumbs";
import { PageContainer } from "metabase/common/data-studio/components/PageContainer";
import { PaneHeader } from "metabase/common/data-studio/components/PaneHeader";
import { usePageTitle } from "metabase/hooks/use-page-title";
import { useSelector } from "metabase/redux";
import { getApplicationName } from "metabase/selectors/whitelabel";
import { Box, Card, Stack, Text, Title } from "metabase/ui";

import S from "./GuidePage.module.css";

export function GuidePage() {
  usePageTitle(t`Guide`);
  const applicationName = useSelector(getApplicationName);

  return (
    <PageContainer className={S.page} gap={0}>
      <PaneHeader
        breadcrumbs={
          <DataStudioBreadcrumbs role="heading">{t`Guide`}</DataStudioBreadcrumbs>
        }
      />
      <Box className={S.content}>
        <Title mb="xl" order={2}>
          {t`Build your semantic layer in Data Studio`}
        </Title>

        <Card shadow="none" withBorder>
          <Stack className={S.cardContent} gap="2rem">
            <Box data-testid="guide-transforms-section">
              <Title mb="md" order={3}>
                {t`Clean up your schema with transforms`}
              </Title>
              <Stack gap="md">
                <Text c="text-secondary">
                  {jt`In Data Studio, ${(
                    <strong key="transforms">{t`Transforms`}</strong>
                  )} materialize SQL or Python as tables in your warehouse and sync them back into ${applicationName}. Find them under ${(
                    <strong key="data-transformation">{t`Data transformation`}</strong>
                  )} — use ${(
                    <strong key="jobs">{t`Jobs`}</strong>
                  )} to schedule tagged batches and ${(
                    <strong key="runs">{t`Runs`}</strong>
                  )} to inspect execution history. Tag transforms to group them and run them with jobs.`}
                </Text>
              </Stack>
            </Box>

            <Box data-testid="guide-publish-section">
              <Title mb="md" order={3}>
                {t`Publish tables for your team and agents to use`}
              </Title>
              <Stack gap="md">
                <Text c="text-secondary">
                  {jt`${(
                    <strong key="connected-data">{t`Connected data`}</strong>
                  )} is where you browse synced tables, edit field metadata, and note the purpose of tables. When a table is ready for self-serve users, publish it to your ${(
                    <strong key="semantic-layer">{t`Semantic layer`}</strong>
                  )}.`}
                </Text>
                <Text c="text-secondary">
                  {jt`The semantic layer in ${applicationName} lives in the ${<strong key="library">{t`Library`}</strong>}, and is where you organize and curate your published tables, measures, segments, and metrics. They're surfaced first in the query builder and in AI queries.`}
                </Text>
              </Stack>
            </Box>

            <Box data-testid="guide-define-section">
              <Title mb="md" order={3}>
                {t`Define your segments, measures and metrics`}
              </Title>
              <Stack gap="md">
                <Text c="text-secondary">
                  {jt`Define ${(
                    <strong key="segments">{t`segments`}</strong>
                  )} and ${(
                    <strong key="measures">{t`measures`}</strong>
                  )} on top of published tables in the semantic layer to encode frequently used filters and summaries. Then use them to help define KPIs as ${(
                    <strong key="metrics">{t`metrics`}</strong>
                  )}, along with their primary dimensions.`}
                </Text>
                <Text c="text-secondary">
                  {jt`Lastly, document business terms in the ${(
                    <strong key="glossary">{t`Glossary`}</strong>
                  )} to help AI agents and your team.`}
                </Text>
              </Stack>
            </Box>
          </Stack>
        </Card>
      </Box>
    </PageContainer>
  );
}

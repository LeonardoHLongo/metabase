import { jt, t } from "ttag";

import { Link } from "metabase/common/components/Link";
import { DataStudioBreadcrumbs } from "metabase/common/data-studio/components/DataStudioBreadcrumbs";
import { PageContainer } from "metabase/common/data-studio/components/PageContainer";
import { PaneHeader } from "metabase/common/data-studio/components/PaneHeader";
import { usePageTitle } from "metabase/hooks/use-page-title";
import { useSelector } from "metabase/redux";
import { getApplicationName } from "metabase/selectors/whitelabel";
import { Box, Button, Card, Divider, Stack, Text, Title } from "metabase/ui";
import * as Urls from "metabase/urls";

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

        <Card className={S.card} shadow="none" withBorder>
          <Box className={S.section} data-testid="guide-transforms-section">
            <Title mb="md" order={3}>
              {t`Clean up your schema with transforms`}
            </Title>
            <Stack gap="md" mb="lg">
              <Text c="text-secondary">
                {jt`${(
                  <strong key="transforms">{t`Transforms`}</strong>
                )} let you preprocess, clean, join, and reshape data directly in ${applicationName}. Write a SQL or Python transform, and ${applicationName} will run it on a schedule and write the results to a table in your database.`}
              </Text>
              <Text c="text-secondary">
                {t`Each transform creates a synced table you can use as a data source for questions, dashboards, and downstream transforms. Chain transforms together to build staging and mart layers without leaving ${applicationName}.`}
              </Text>
              <Text c="text-secondary">
                {jt`Organize transforms with tags, then use ${(
                  <strong key="jobs">{t`jobs`}</strong>
                )} to run groups of transforms on a schedule. You can also run transforms manually from the ${(
                  <strong key="runs">{t`Runs`}</strong>
                )} view whenever you need fresh data.`}
              </Text>
            </Stack>
            <Link to={Urls.transformList()}>
              <Button variant="filled">{t`Go to transforms`}</Button>
            </Link>
          </Box>

          <Divider className={S.divider} />

          <Box className={S.section} data-testid="guide-publish-section">
            <Title mb="md" order={3}>
              {t`Publish tables for your team and agents to use`}
            </Title>
            <Stack gap="md" mb="lg">
              <Text c="text-secondary">
                {jt`Start in ${(
                  <strong key="connected-data">{t`Connected data`}</strong>
                )} to browse every table in your ${applicationName}, edit metadata, and set visibility. When a table is ready for analytics, ${(
                  <strong key="publish-library">{t`publish it to the Library`}</strong>
                )} so it becomes a trusted, curated data source.`}
              </Text>
              <Text c="text-secondary">
                {t`Published tables appear first when people pick data in the query builder, nudging everyone toward the same definitions. The Library separates polished, reusable tables from ad hoc analyses.`}
              </Text>
              <Text c="text-secondary">
                {t`Organize published tables into subcollections for teams like Sales or Marketing. Tables published to the Library remain available in the data browser, and Metabot can use them as reliable context for AI-assisted queries.`}
              </Text>
            </Stack>
            <Link to={Urls.dataStudioData()}>
              <Button variant="filled">{t`View your connected data`}</Button>
            </Link>
          </Box>

          <Divider className={S.divider} />

          <Box className={S.section} data-testid="guide-define-section">
            <Title mb="md" order={3}>
              {t`Define your segments, measures and metrics`}
            </Title>
            <Stack gap="md" mb="lg">
              <Text c="text-secondary">
                {jt`${(
                  <strong key="segments">{t`Segments`}</strong>
                )} are saved filters on a table, like an official definition of an active user. ${(
                  <strong key="measures">{t`Measures`}</strong>
                )} are saved aggregations, like Net Promoter Score. Create them on a table in Connected data or on a published table in the Library.`}
              </Text>
              <Text c="text-secondary">
                {t`People can apply segments and measures from the Filter and Summarize blocks in the query builder, so everyone uses the same logic instead of rebuilding it from scratch.`}
              </Text>
              <Text c="text-secondary">
                {jt`Save standardized calculations as ${(
                  <strong key="metrics">{t`metrics`}</strong>
                )} in the ${(
                  <strong key="library">{t`Library`}</strong>
                )} to make them easy to find in navigation, search, and the query builder. Use the ${(
                  <strong key="glossary">{t`Glossary`}</strong>
                )} to document terms and keep your semantic layer understandable for LLMs and your team.`}
              </Text>
            </Stack>
            <Link to={Urls.dataStudioLibrary()}>
              <Button variant="filled">{t`Go to the Semantic layer`}</Button>
            </Link>
          </Box>
        </Card>
      </Box>
    </PageContainer>
  );
}

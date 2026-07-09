import { renderWithProviders, screen } from "__support__/ui";

import { GuidePage } from "./GuidePage";

jest.mock("metabase/nav/components/AppSwitcher", () => ({
  AppSwitcher: () => <div data-testid="app-switcher" />,
}));

describe("GuidePage", () => {
  it("renders the page header, title, and sections", () => {
    renderWithProviders(<GuidePage />);

    expect(screen.getByTestId("data-studio-breadcrumbs")).toHaveTextContent(
      "Guide",
    );
    expect(screen.getByTestId("app-switcher")).toBeInTheDocument();
    expect(
      screen.getByText("Build your semantic layer in Data Studio"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Clean up your schema with transforms"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Publish tables for your team and agents to use"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Define your segments, measures and metrics"),
    ).toBeInTheDocument();
  });

  it("shows section content without action buttons", () => {
    renderWithProviders(<GuidePage />);

    expect(screen.getByTestId("guide-transforms-section")).toHaveTextContent(
      /Find them under Data transformation/,
    );
    expect(screen.getByTestId("guide-publish-section")).toHaveTextContent(
      /Connected data is where you browse synced tables/,
    );
    expect(screen.getByTestId("guide-define-section")).toHaveTextContent(
      /Define segments and measures on top of published tables/,
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

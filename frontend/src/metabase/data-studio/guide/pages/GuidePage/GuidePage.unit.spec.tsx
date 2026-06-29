import { renderWithProviders, screen, within } from "__support__/ui";

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

  it("shows section content and action buttons", () => {
    renderWithProviders(<GuidePage />);

    expect(screen.getByTestId("guide-transforms-section")).toHaveTextContent(
      /Transforms let you preprocess, clean, join, and reshape data/,
    );
    expect(screen.getByTestId("guide-publish-section")).toHaveTextContent(
      /Start in Connected data to browse every table/,
    );
    expect(screen.getByTestId("guide-define-section")).toHaveTextContent(
      /Segments are saved filters on a table/,
    );
    expect(
      within(screen.getByTestId("guide-define-section")).getByRole("button", {
        name: "Go to the Semantic layer",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Go to transforms" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "View your connected data" }),
    ).toBeInTheDocument();
  });
});

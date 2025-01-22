import { render, screen, fireEvent } from "@testing-library/react"
import Navbar from "../Navbar"
import { MemoryRouter } from "react-router-dom"

describe("Navbar", () => {
  test("renders logo text", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    expect(screen.getByText("Image Gallery")).toBeInTheDocument()
  })
  test("renders navigation links", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    expect(screen.getAllByText("Home").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Gallery").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Upload").length).toBeGreaterThan(0)
    expect(screen.getAllByText("About").length).toBeGreaterThan(0)
  })

  test("toggles mobile menu when hamburger button is clicked", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    const menuButton = screen.getByRole("button")

    // Menu should be hidden initially
    expect(
      screen.getByRole("navigation").querySelector(".md\\:hidden")
    ).toHaveClass("md:hidden")

    // Click to show menu
    fireEvent.click(menuButton)
    expect(
      screen.getByRole("navigation").querySelector(".md\\:hidden")
    ).toHaveClass("md:hidden")

    // Click to hide menu
    fireEvent.click(menuButton)
    expect(
      screen.getByRole("navigation").querySelector(".md\\:hidden")
    ).toHaveClass("md:hidden")
  })
})

import { render, screen } from "@testing-library/react"
import Footer from "../Footer"
import { MemoryRouter } from "react-router-dom"

describe("Footer", () => {
  test("renders about section", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )
    expect(screen.getByText("About Us")).toBeInTheDocument()
    expect(
      screen.getByText(/Share and explore beautiful images/)
    ).toBeInTheDocument()
  })

  test("renders quick links", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )
    expect(screen.getByText("Quick Links")).toBeInTheDocument()
    const links = ["Home", "Gallery", "Upload", "About"]
    links.forEach((link) => {
      expect(screen.getByText(link)).toBeInTheDocument()
    })
  })

  test("renders social links", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )
    expect(screen.getByText("Connect With Us")).toBeInTheDocument()
    const socialLinks = ["Twitter", "Facebook", "Instagram"]
    socialLinks.forEach((link) => {
      const socialLink = screen.getByText(link)
      expect(socialLink).toBeInTheDocument()
      expect(socialLink.closest("a")).toHaveAttribute("target", "_blank")
      expect(socialLink.closest("a")).toHaveAttribute(
        "rel",
        "noopener noreferrer"
      )
    })
  })

  test("renders copyright notice", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )
    const year = new Date().getFullYear()
    expect(
      screen.getByText(`© ${year} Image Gallery. All rights reserved.`)
    ).toBeInTheDocument()
  })
})

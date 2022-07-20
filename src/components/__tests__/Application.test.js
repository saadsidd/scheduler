import React from "react";

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  waitForElementToBeRemoved
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
  
    await waitForElement(() => getByText("Monday"))
  
    fireEvent.click(getByText("Tuesday"));
  
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);

    // Wait until appointments are returned from mock api
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // Pick first empty appointment
    const appointment = getAllByTestId(container, "appointment")[0];

    // Click the '+' add appointment button
    fireEvent.click(getByAltText(appointment, "Add"));

    // Type a student name in the input
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });

    // Click on an interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // Click on save to submit appointment
    fireEvent.click(getByText(appointment, "Save"));

    // Check if we are in SAVING mode
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // Wait until SAVING mode has transitioned to SHOW
    await waitForElementToBeRemoved(() => getByText(appointment, "Saving"));

    // Check if student's appointment was created successfully
    expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();
  });
});
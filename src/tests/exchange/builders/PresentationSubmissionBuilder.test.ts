import { PresentationSubmissionBuilder } from "../../..";

describe("PresentationSubmissionBuilder", () => {
  describe("end-to-end tests", () => {
    it("builds a simple Presentation Submission", async () => {
      const presentationSubmission = new PresentationSubmissionBuilder()
        .id("presentation_submission_123")
        .definitionId("presentation_definition_123")
        .descriptorMap(
          {
            id: "eoc_output",
            format: "jwt_vc",
            path: "$.verifiableCredential",
          },
          {
            id: "eoc_output2",
            format: "jwt_vc",
            path: "$.verifiableCredential",
          }
        )
        .build();

      expect(presentationSubmission).toEqual({
        id: "presentation_submission_123",
        definition_id: "presentation_definition_123",
        descriptor_map: [
          {
            id: "eoc_output",
            format: "jwt_vc",
            path: "$.verifiableCredential",
          },
          {
            id: "eoc_output2",
            format: "jwt_vc",
            path: "$.verifiableCredential",
          },
        ],
      });
    });

    it("builds a PresentationSubmission object with a nested DescriptorMapEntryBuilder", () => {
      const submission = new PresentationSubmissionBuilder()
        .id("123")
        .definitionId("def-456")
        .startDescriptorMapEntry()
        .id("dm1")
        .format("jwt_vc")
        .path("$.claim")
        .endDescriptorMapEntry()
        .build();

      expect(submission.id).toEqual("123");
      expect(submission.definition_id).toEqual("def-456");
      expect(submission.descriptor_map.length).toEqual(1);

      const dm1 = submission.descriptor_map[0];
      expect(dm1.id).toEqual("dm1");
      expect(dm1.format).toEqual("jwt_vc");
      expect(dm1.path).toEqual("$.claim");
    });
  });

  describe("build() error conditions", () => {
    it("throws error when id is missing", () => {
      expect(() =>
        new PresentationSubmissionBuilder()
          .definitionId("abc")
          .descriptorMap({
            id: "id1",
            format: "jwt_vc",
            path: "$.claim",
          })
          .build()
      ).toThrowError(
        "Missing required fields in PresentationSubmissionBuilder: id"
      );
    });
    it("throws error when definition_id is missing", () => {
      expect(() =>
        new PresentationSubmissionBuilder()
          .id("123")
          .descriptorMap({
            id: "id1",
            format: "jwt_vc",
            path: "$.claim",
          })
          .build()
      ).toThrowError(
        "Missing required fields in PresentationSubmissionBuilder: definition_id"
      );
    });

    it("throws error when descriptor_map is missing", () => {
      expect(() =>
        new PresentationSubmissionBuilder()
          .id("123")
          .definitionId("abc")
          .build()
      ).toThrowError(
        "Missing required fields in PresentationSubmissionBuilder: descriptor_map"
      );
    });
  });
});

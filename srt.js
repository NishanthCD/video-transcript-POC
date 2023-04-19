import axios from "axios";
import * as fs from "fs";

// =============>instanceId a73c9481-ef5b-4c6c-919a-e2738fc96ba1 =========================>contentApi.data.id b767caf9-ea44-4f16-8f37-3d24aaa6845b =========================>revisionsApi.data.id 69b07628-25fc-470d-918b-5826c2d6a53d
const apiId = "a73c9481-ef5b-4c6c-919a-e2738fc96ba1";
const contentId = "cbbe34c7-76b4-4020-9fcc-59b26e734ade";
const revisionId = "eb820837-3b04-45b2-b6a1-b69fe7f13a13";

const file = fs.readFileSync(`${process.cwd()}/samplesrt.srt`, "utf-8");

const headers = {
  "Content-Type": "application/json",
  Authorization:
    "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjhiMjE5MThhLWRmYTMtNDE3Zi05MTRjLTQyNmNkOTFhZTVlYiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE2ODE4OTUwMDQsImV4cCI6MTY4MTg5ODYwNCwiaXNzIjoiaHR0cHM6Ly9hcGkuYnJpZ2h0c3BhY2UuY29tL2F1dGgiLCJhdWQiOiJodHRwczovL2FwaS5icmlnaHRzcGFjZS5jb20vYXV0aC90b2tlbiIsInN1YiI6IjMyNyIsInRlbmFudGlkIjoiYTczYzk0ODEtZWY1Yi00YzZjLTkxOWEtZTI3MzhmYzk2YmExIiwiYXpwIjoibG1zIiwic2NvcGUiOiIqOio6KiIsImp0aSI6IjE0YWU0ZmQwLTgyZDYtNGI3Mi04NjY0LWQyYjMwMTc5NmEyZCJ9.dN9yxDRbTj_2BTca3hmAr1SiXQLr3PdqZK5sv6H9Vp_-mbpbAUX4kjgcgN6FYVOaDizb-vq3XGAmWdSiPD0J8pZq1MmzJCDNFeKjTYYzo4Z7VBuXWcstNP_Z9xQC0qLrzyLCUGUZXgo2O9_OsFDZz9IFuE-tIi37DvgovMK4rZKyV_5AZ9jdqmg-Zwa2UeYE2GoZs00V5-vBB3Y6mv4M8EtBNnNlmRAac-N-dLALHHA8E6JeTlVm4fbsPD8EnCpFrnFBTaCkU7oVulvJkh2oepEKF0jg4UnfZo-jcB8UOGWsRX2G-b0xeG7QVh_XZNfXWUkTgwW2TD5imybNw9tEIQ",
};

const contentLength = fs.statSync(`${process.cwd()}/samplesrt.srt`).size;

const srtUpload = await axios({
  method: "post",
  url: `https://api.us-east-1.content-service.brightspace.com/api/${apiId}/content/${contentId}/revisions?draftFromSource=${revisionId}`,
  headers: {
    Authorization: headers.Authorization,
  },
})
  .then(function (response) {
    console.log("==================>", response);
    return response;
  })
  .catch(function (error) {
    console.log(error);
  });

const srtProcess = await axios({
  method: "PUT",
  url: `https://api.us-east-1.content-service.brightspace.com/api/${apiId}/content/${contentId}/revisions/${revisionId}/resources/captions?locale=en-us&adjusted=false`,
  data: file,
  headers: {
    "Content-Type": "text/vtt",
    "Content-Length": contentLength,
    Authorization: headers.Authorization,
  },
})
  .then(function (response) {
    return response;
  })
  .catch(function (error) {
    console.log(error);
  });

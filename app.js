import axios from "axios";
import * as fs from "fs";
import FormData from "form-data";

const contentData = {
  title: "adatest.mp4",
  type: "Video",
  clientApp: "LmsCapture",
};

const headers = {
  "Content-Type": "application/json",
  Authorization:
    "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjhiMjE5MThhLWRmYTMtNDE3Zi05MTRjLTQyNmNkOTFhZTVlYiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE2ODE4OTUwMDQsImV4cCI6MTY4MTg5ODYwNCwiaXNzIjoiaHR0cHM6Ly9hcGkuYnJpZ2h0c3BhY2UuY29tL2F1dGgiLCJhdWQiOiJodHRwczovL2FwaS5icmlnaHRzcGFjZS5jb20vYXV0aC90b2tlbiIsInN1YiI6IjMyNyIsInRlbmFudGlkIjoiYTczYzk0ODEtZWY1Yi00YzZjLTkxOWEtZTI3MzhmYzk2YmExIiwiYXpwIjoibG1zIiwic2NvcGUiOiIqOio6KiIsImp0aSI6IjE0YWU0ZmQwLTgyZDYtNGI3Mi04NjY0LWQyYjMwMTc5NmEyZCJ9.dN9yxDRbTj_2BTca3hmAr1SiXQLr3PdqZK5sv6H9Vp_-mbpbAUX4kjgcgN6FYVOaDizb-vq3XGAmWdSiPD0J8pZq1MmzJCDNFeKjTYYzo4Z7VBuXWcstNP_Z9xQC0qLrzyLCUGUZXgo2O9_OsFDZz9IFuE-tIi37DvgovMK4rZKyV_5AZ9jdqmg-Zwa2UeYE2GoZs00V5-vBB3Y6mv4M8EtBNnNlmRAac-N-dLALHHA8E6JeTlVm4fbsPD8EnCpFrnFBTaCkU7oVulvJkh2oepEKF0jg4UnfZo-jcB8UOGWsRX2G-b0xeG7QVh_XZNfXWUkTgwW2TD5imybNw9tEIQ",
};

const instanceId = "a73c9481-ef5b-4c6c-919a-e2738fc96ba1";

const responseApiPayload = { extension: "mp4" };

const completeApiPayload = {
  parts: [],
};

const file = fs.readFileSync(`${process.cwd()}/testersPlayground.mp4`);
const formData = new FormData();
formData.append("file", file);

// this Api is the first hitting API
const contentApi = await axios
  .post(
    `https://api.us-east-1.content-service.brightspace.com/api/${instanceId}/content`,
    contentData,
    { headers }
  )
  .then(function (response) {
    return response;
  })
  .catch(function (error) {
    console.log(error);
  });

// this Api is the second hitting API
const revisionsApi = await axios
  .post(
    `https://api.us-east-1.content-service.brightspace.com/api/${instanceId}/content/${contentApi.data.id}/revisions`,
    responseApiPayload,
    { headers }
  )
  .then(function (response) {
    return response;
  })
  .catch(function (error) {
    console.log(error);
  });

// this Api is the third hitting API
const multipPartApi = await axios

  .post(
    `https://api.us-east-1.content-service.brightspace.com/api/${instanceId}/content/${contentApi.data.id}/revisions/${revisionsApi.data.id}/upload/multipart
    `,
    responseApiPayload,
    { headers }
  )
  .then(function (response) {
    return response;
  })
  .catch(function (error) {
    console.log(error);
  });

// this Api is the fourth hitting API
const batchUploadApi = await axios
  .get(
    `https://api.us-east-1.content-service.brightspace.com/api/${instanceId}/content/${contentApi.data.id}/revisions/${revisionsApi.data.id}/upload/multipart/batch?uploadId=${multipPartApi.data.uploadId}&numParts=1`,
    { headers }
  )
  .then(function (response) {
    return response;
  })
  .catch(function (error) {
    console.log(error);
  });

// missing querystring parameters

// this Api is the fifth hitting API
const uploadTriggerer = await axios({
  method: "PUT",
  data: file,
  url: `${batchUploadApi.data[0].value}`,
})
  .then(function (response) {
    return response;
  })
  .catch(function (error) {
    console.log(error);
  });

completeApiPayload.parts.push({
  ETag: uploadTriggerer.headers.etag,
  PartNumber: 1,
});

// this Api is the sixth hitting API
const complete = await axios
  .post(
    `https://api.us-east-1.content-service.brightspace.com/api/${instanceId}/content/${contentApi.data.id}/revisions/${revisionsApi.data.id}/upload/multipart/complete?uploadId=${multipPartApi.data.uploadId}`,
    completeApiPayload,
    { headers }
  )
  .then(function (response) {
    return response;
  })
  .catch(function (error) {
    console.log(error);
  });

const makeRequestUntilResponse = async function () {
  const response = await axios({
    method: "get",
    url: `https://api.us-east-1.content-service.brightspace.com/api/${instanceId}/content/${contentApi.data.id}/revisions/${revisionsApi.data.id}/progress`,
    headers,
  });

  if (response.data.percentComplete === 100) {
  } else {
    return await makeRequestUntilResponse();
  }
};

const processApi = await axios({
  method: "post",
  url: `https://api.us-east-1.content-service.brightspace.com/api/${instanceId}/content/${contentApi.data.id}/revisions/${revisionsApi.data.id}/process`,
  headers: {
    Authorization: headers.Authorization,
  },
})
  .then(async function (response) {
    makeRequestUntilResponse();
  })
  .catch(function (error) {
    console.log(error);
  });

// console.log(
//   "==========================>",
//   `https://api.us-east-1.content-service.brightspace.com/api/${instanceId}/content/${contentApi.data.id}/revisions/${revisionsApi.data.id}/progress`
// );

console.log(
  "=============>instanceId",
  instanceId,
  "=========================>contentApi.data.id",
  contentApi.data.id,
  "=========================>revisionsApi.data.id",
  revisionsApi.data.id
);

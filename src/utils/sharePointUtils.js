// import { Linking, Alert } from 'react-native'; // Import Linking and Alert for notifications and settings

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const retrieveAccessToken = async () => {
  let clientId, clientSecret, tenantId;
  // clientId = '0e6152d6-81a4-4339-aa9a-db58a3ae57e2';
  // clientSecret = '3NLkOpaD1rLKubGUcEqEPJQvMZab8MuDoWw39E81eko=';
  clientId = "b1734805-3b9c-4032-a86a-dadaf3773fae";
  clientSecret = "_yi8Q~IKwqvZBn35SM9wLVV27qbuzLYexY1Dyao7";
  tenantId = "4a49838b-9576-4a6e-9bac-3704ad1e3866";

  const tokenUrl = `https://accounts.accesscontrol.windows.net/4a49838b-9576-4a6e-9bac-3704ad1e3866/tokens/OAuth/2`;
  const formDigestUrl = `https://solarvest.sharepoint.com/sites/ProjectDevelopment/_api/contextinfo`;
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const body = {
    grant_type: `client_credentials`,
    client_id: `${clientId}@${tenantId}`,
    client_secret: clientSecret,
    resource: `00000003-0000-0ff1-ce00-000000000000/solarvest.sharepoint.com@${tenantId}`,
  };
  try {
    const storedTokenJSON = await AsyncStorage.getItem("sharepointToken");
    const storedToken = JSON.parse(storedTokenJSON);
    if (!storedToken) {
      throw new Error("Token not found");
    }
    const response = await axios({
      method: "GET",
      url: "https://solarvest.sharepoint.com/sites/ProjectDevelopment/_api/web",
      headers: {
        Authorization: `Bearer ${storedToken.accessToken}`,
        Accept: "application/json;odata=verbose",
      },
    });
    if (response) {
      return [storedToken.accessToken, storedToken.formDigest];
    }
  } catch (error) {
    // console.log(error.response.data);
    try {
      const response = await axios({
        method: "POST",
        url: tokenUrl,
        headers: headers,
        data: body,
      });
      if (response.data.access_token) {
        try {
          const digestResponse = await axios({
            method: "POST",
            url: formDigestUrl,
            headers: {
              Accept: "application/json;odata=nometadata",
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer ${response.data.access_token}`,
            },
          });

          if (digestResponse) {
            const tokens = {
              accessToken: response.data.access_token,
              formDigest: digestResponse.data.FormDigestValue.split(",")[0],
            };
            const jsonString = JSON.stringify(tokens);

            // Set the stringified object in AsyncStorage
            AsyncStorage.setItem("sharepointToken", jsonString)
              .then(() => {
                console.log("sharepoint token Generated");
              })
              .catch((error) => {
                console.log("Error generating sharepoint token:", error);
              });
            return [
              response.data.access_token,
              digestResponse.data.FormDigestValue.split(",")[0],
            ];
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error.response.data);
    }
  }
};

export const checkFolderExist = async (folderUri,project) => {
  const checkUri = `https://solarvest.sharepoint.com/sites/ProjectDevelopment/_api/web/GetFolderByServerRelativeUrl('ListofImage/${folderUri}')`;
  const uploadUri = `https://solarvest.sharepoint.com/sites/ProjectDevelopment/_api/web/folders`;
  let folderExist = true;
  try {
    const [accessToken, formDigest] = await retrieveAccessToken();

    const response = await axios.get(checkUri, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json;odata=verbose",
      },
    });

    console.log("File Exist: " + response.data.d.Exists);
    return response.data.d.Exists;
  } catch (error) {
    console.log(
      "checkFolderExist//////////////////",
      error.response.data.error.code
    );
    // *********Create sharepoint folder path***********
    if (
      error.response.data.error.code ==
      "-2147024894, System.IO.FileNotFoundException"
    ) {
      try {
        console.log("ListofImage/////////////////////");

        console.log("ListofImage/////////////////////", project);

        let parentFolder = project;
        const [accessToken, formDigest] = await retrieveAccessToken();

        for (let path of folderUri.split("/").splice(1)) {
          console.log(
            "ListofImage/////////////////////",
            `ListofImage/${parentFolder}/${path}`
          );
          console.log("ListofImage/////////////////////", parentFolder);

          try {
            const response = await axios({
              method: "POST",
              url: uploadUri,
              data: {
                __metadata: {
                  type: "SP.Folder",
                },
                ServerRelativeUrl: `ListofImage/${parentFolder}/${path}`,
              },
              headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "X-RequestDigest": formDigest,
              },
            });
            parentFolder += "/" + path;
            console.log("Folder created: " + response.data.d.Exists);
            folderExist = response.data.d.Exists;
          } catch (error) {
            console.log(error.response.data);
            return false;
          }
        }
      } catch (error) {
        console.log("FileNotFoundException/////////////////////", error);
      }
    }
  }
  return folderExist;
};

This is the README file !!!

To run the build locally

Install Maven and run the following command from the currency-v1 directory

`mvn clean install -Ptest -DAPIGEE_ORG={org} -DAPIGEE_USERNAME={username} -DAPIGEE_PASSWORD={password} -DAPI_DOMAIN_TEST={org}-{env}.apigee.net`

For example

`mvn clean install -Ptest -DAPIGEE_ORG=testORg -DAPIGEE_USERNAME=test@example.com -DAPIGEE_PASSWORD=Iamasecret -DAPI_DOMAIN_TEST=testORg-test.apigee.net`

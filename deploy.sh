FUNC_ARN=arn:aws:lambda:ap-southeast-1:917253244281:function:GenerateIconButton
ZIP_FILE=deploy.zip
zip -r $ZIP_FILE ./index.mjs ./assets
aws lambda update-function-code --function-name $FUNC_ARN --zip-file fileb://$ZIP_FILE > /dev/null
rm $ZIP_FILE
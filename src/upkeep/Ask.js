

just implement this thus every question will have these fileUploadConfig and if the questionType is not file it will be {} else fileUploadConfig : {
    restrictFileTypes: boolean,
    allowedFileTypes: array
    maxFileSize: string,
  }

do the following 

1. when the questionType === file 
then do the follow 
2. show these "Allow only specific file types" (restrictFileTypes) which is switch ( on for true and off for false)
and when the restrictFileTypes is true, then display the options ["pdf", "document", "image"] which will be a checkbox and their value will be recorded in allowedFileTypes (being an array)
3.show "Maximum file size" which will be an option of ["1Mb", "5Mb", "10Mb"] and their value will be recorded as maxFileSize

and all is collectively saved as fileUploadConfig

fileUploadConfig : {
    restrictFileTypes: boolean,
    allowedFileTypes: array ["document", "pdf", "image"]
    maxFileSize: string ["1Mb", "5Mb", "10Mb"],
  }
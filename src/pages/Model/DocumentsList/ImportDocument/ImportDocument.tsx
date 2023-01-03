import { message } from 'antd'
import { NoticeType } from 'antd/es/message/interface'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import IDocument from '../../../../models/Document'
import ModelProvider from '../../../../providers/model.provider'
import { updateMode, ModelPageMode, incrementAmountOfFiles, updateActiveFileIndex, addNewDocument } from '../../../../reducers/modelReducer'
import { RootState } from '../../../../reducers/rootReducers'
import s from './ImportDocument.module.scss'
import { Trans, useTranslation } from 'react-i18next'
import { FileUploader } from 'react-drag-drop-files'
import { Storage } from 'aws-amplify'
import { useEffect } from 'react'
import { IMessageEvent, w3cwebsocket as W3CWebSocket } from "websocket"

export default function ImportDocument() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { modelId } = useParams()
  const [messageApi, contextHolder] = message.useMessage()

  const amountOfFiles = useSelector((state: RootState) => state.model.amountOfFiles)

  const importFile = async (files: FileList | null) => {
    if (files && files?.length > 0 && modelId) {

      for (let i = 0; i < files.length; i++) {
        const file: File = files[i]

        try {
          const uploadedFileToAWS = await Storage.put(
            file.name, file,
            {
              expires: addOneMonthToCurrentDate(new Date())
            }
          )
          const uploadedFileURL = await Storage.get(uploadedFileToAWS.key)

          ModelProvider.uploadPDFFile(modelId, uploadedFileURL)
        } catch (exception) {
          showAlert("error", t("ModelPage.alerts.errorWhileUploadingPDF"))
          console.error("An error occurred on the server while uploading a new document", exception)
        }
      }
    }
  }

  const showAlert = (type: NoticeType | undefined, message: string): void => {
    messageApi.open({
      type: type,
      content: message
    })
  }

  const handleChange = (files: FileList) => {
    importFile(files)
  }

  const handleErrorWhileUploadingNotPDF = () => {
    showAlert("error", t("ModelPage.alerts.errorWhileUploadingNotPDF"))
    console.error(t("ModelPage.alerts.errorWhileUploadingNotPDF"))
  }

  const addOneMonthToCurrentDate = (currentDate: Date): Date => {
    return new Date(currentDate.setMonth(currentDate.getMonth() + 1))
  }

  const getDocument = (idDocument: string): void => {
    ModelProvider.getDocument(idDocument)
      .then((document: IDocument) => {
        showAlert("success", t("ModelPage.alerts.successfullyUploadedPDFFileAlert"))
        setDocumentToStore(document)
      })
      .catch((err) => {
        showAlert("error", t("ModelPage.alerts.errorWhileUploadingPDF"))
        console.error("An error occurred on the server while uploading a new document", err)
      })
  }

  const setDocumentToStore = (document: IDocument) => {
    dispatch(updateMode(ModelPageMode.ANNOTATION))
    dispatch(addNewDocument(document))
    dispatch(incrementAmountOfFiles())
    dispatch(updateActiveFileIndex(amountOfFiles))
  }

  useEffect(() => {
    const client = new W3CWebSocket('ws://192.168.1.6:8000');

    client.onmessage = (message: IMessageEvent) => {
      const idDocument = message.data.toString()
      console.log(idDocument)
      getDocument(idDocument)
    }
  }, [])

  return (
    <FileUploader
      handleChange={handleChange}
      name="file"
      types={["PDF"]}
      multiple
      hoverTitle=" "
      onTypeError={() => handleErrorWhileUploadingNotPDF()}
    >
      <div className={s["ImportDocument"]}>
        <svg className={s["ImportDocument-Icon"]} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="8" fill="#F2F0FF" />
          <path d="M16.6667 23.3333L20 20M20 20L23.3334 23.3333M20 20V27.5M26.6667 23.9524C27.6846 23.1117 28.3334 21.8399 28.3334 20.4167C28.3334 17.8854 26.2813 15.8333 23.75 15.8333C23.5679 15.8333 23.3976 15.7383 23.3051 15.5814C22.2184 13.7374 20.212 12.5 17.9167 12.5C14.4649 12.5 11.6667 15.2982 11.6667 18.75C11.6667 20.4718 12.3629 22.0309 13.4891 23.1613" stroke="#9482FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <div className={s["ImportDocument-Title"]}>
          <Trans
            i18nKey="ModelPage.documentsListSection.importDocumentTitle"
            components={{
              span: <span>Click to upload</span>,
            }}
          >
          </Trans>
        </div>

        <div className={s["ImportDocument-Subtitle"]}>
          {t("ModelPage.documentsListSection.importDocumentSubtitle")}
        </div>
      </div>

      {contextHolder}
    </FileUploader>
  )
}
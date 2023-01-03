import { Button, message, Row } from 'antd'
import { NoticeType } from 'antd/es/message/interface'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import ModelProvider from '../../../../providers/model.provider'
import { IAnnotation, addNewAnnotation, updateAnnotationsToggle } from '../../../../reducers/modelReducer'
import s from './AddAnnotationWindow.module.scss'
import AddAnnotationWindowHeader from './AddAnnotationWindowHeader/AddAnnotationWindowHeader'
import SetAnnotationLabel from './SetAnnotationLabel/SetAnnotationLabel'
import SetAnnotationType from './SetAnnotationType/SetAnnotationType'
import { useTranslation } from 'react-i18next'
import IAnntotationPostData from '../../../../models/AnntotionPostData'

interface IProps {
  left: number
  top: number
  width: number
  clearSelectedWordsIdArr(): void
  selectedWordsIdArr: string[]
}

export enum IAddAnnotationWindowMode {
  "SET_ANNOTATION_LABEL" = "SET_ANNOTATION_LABEL",
  "SET_ANNOTATION_TYPE" = "SET_ANNOTATION_TYPE"
}

export interface INewAnnotationInfo {
  annotationLabel: string
  annotationType: number
  colorHexa: string
}

export default function AddAnnotationWindow({ left, top, width, clearSelectedWordsIdArr, selectedWordsIdArr }: IProps) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [messageApi, contextHolder] = message.useMessage()
  const [addAnnotationWindowMode, setAddAnnotationWindowMode] = useState<IAddAnnotationWindowMode>(IAddAnnotationWindowMode.SET_ANNOTATION_LABEL)

  const [newAnnotationInfo, setNewAnnotationInfo] = useState<INewAnnotationInfo>({
    annotationLabel: "",
    annotationType: 0,
    colorHexa: ""
  })
  const { modelId } = useParams()

  const createNewAnnotation = () => {
    clearSelectedWordsIdArr()

    if (modelId) {
      const newAnnotationData: IAnntotationPostData = {
        idModel: modelId,
        name: newAnnotationInfo.annotationLabel,
        type: newAnnotationInfo.annotationType,
        colorHexa: newAnnotationInfo.colorHexa
      }

      ModelProvider.createNewAnnotation(newAnnotationData, selectedWordsIdArr)
        .then((newAnnotationData: IAnnotation) => {
          dispatch(addNewAnnotation(newAnnotationData))
          dispatch(updateAnnotationsToggle())
        })
        .catch(err => {
          showAlert("error", t("ModelPage.alerts.errorWhileCreatingNewAnnotation"))
          console.error("An error occurred on the server while creating a new annotation", err)
        })
    }
  }

  const showAlert = (type: NoticeType | undefined, message: string): void => {
    messageApi.open({
      type: type,
      content: message
    })
  }

  return (
    <div
      className={s["AddAnnotationWindow"]}
      style={{ left: left + width + 20, top }}
    >
      <AddAnnotationWindowHeader
        clearSelectedWordsIdArr={clearSelectedWordsIdArr}
        addAnnotationWindowMode={addAnnotationWindowMode}
        setAddAnnotationWindowMode={setAddAnnotationWindowMode}
        newAnnotationInfo={newAnnotationInfo}
        setNewAnnotationInfo={setNewAnnotationInfo}
      />

      {addAnnotationWindowMode === IAddAnnotationWindowMode.SET_ANNOTATION_LABEL &&
        <div className={s["AddAnnotationWindow-Title"]}>
          {t("ModelPage.createNewAnnotationWindow.selectAnnotationLabelTitle")}
        </div>
      }

      {addAnnotationWindowMode === IAddAnnotationWindowMode.SET_ANNOTATION_LABEL &&
        <SetAnnotationLabel
          setAddAnnotationWindowMode={setAddAnnotationWindowMode}
          setNewAnnotationInfo={setNewAnnotationInfo}
          newAnnotationInfo={newAnnotationInfo}
        />
      }

      {addAnnotationWindowMode === IAddAnnotationWindowMode.SET_ANNOTATION_TYPE &&
        <SetAnnotationType
          setAddAnnotationWindowMode={setAddAnnotationWindowMode}
          setNewAnnotationInfo={setNewAnnotationInfo}
          newAnnotationInfo={newAnnotationInfo}
        />
      }

      <Row
        className={s["AddAnnotationWindow-BtnBox"]}
        justify="end"
      >
        <Button
          onClick={() => addAnnotationWindowMode === IAddAnnotationWindowMode.SET_ANNOTATION_LABEL
            ? setAddAnnotationWindowMode(IAddAnnotationWindowMode.SET_ANNOTATION_TYPE)
            : createNewAnnotation()
          }
          disabled={
            (
              addAnnotationWindowMode === IAddAnnotationWindowMode.SET_ANNOTATION_LABEL
              && !newAnnotationInfo.annotationLabel
            )
            ||
            (
              addAnnotationWindowMode === IAddAnnotationWindowMode.SET_ANNOTATION_TYPE
              && !newAnnotationInfo.annotationType
            )
          }
        >
          OK
        </Button>
      </Row>
    </div >
  )
}
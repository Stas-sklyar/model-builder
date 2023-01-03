import { Row, Col, Button } from 'antd'
import { IAddAnnotationWindowMode, INewAnnotationInfo } from '../AddAnnotationWindow'
import s from '../AddAnnotationWindow.module.scss'
import AnnotationLabelsList from './AnnotationLabelsList/AnnotationLabelsList'
import SetAnnotationLabelFooter from './SetAnnotationLabelFooter/SetAnnotationLabelFooter'

interface IProps {
  setAddAnnotationWindowMode(mode: IAddAnnotationWindowMode): void
  setNewAnnotationInfo(annotationLabel: INewAnnotationInfo): void
  newAnnotationInfo: INewAnnotationInfo
}

export interface IAnnotationLabel {
  name: string
  iconColor: string
}

export default function SetAnnotationLabel({ setNewAnnotationInfo, newAnnotationInfo }: IProps) {

  return (
    <div>
      <AnnotationLabelsList
        setNewAnnotationInfo={setNewAnnotationInfo}
        newAnnotationInfo={newAnnotationInfo}
      />

      <SetAnnotationLabelFooter
        setNewAnnotationInfo={setNewAnnotationInfo}
        newAnnotationInfo={newAnnotationInfo}
      />
    </div>
  )
}
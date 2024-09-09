/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { RxCross2 } from "react-icons/rx"
import { useDispatch, useSelector } from "react-redux"

import {
  createSubSection,
  updateSubSection,
} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse } from "../../../../../slices/courseSlice"
import IconBtn from "../../../../Common/IconBtn"
import Upload from "../Upload"

export default function SubSectionModal({
  subSectionType,
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm()

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)
  const [fileName, setFileName] = useState("")

  useEffect(() => {
    if (view || edit) {
      setValue("lectureTitle", modalData.title)
      setValue("lectureDesc", modalData.description)
      if (subSectionType === 'video') {
        setValue("lectureVideo", modalData.videoUrl)
      }
      else{
        setValue("pdfFile", modalData.pdfUrl)
        setFileName(modalData.fileName)
      }
    }
  }, [])

  // detect whether file is updated or not
  const isFileUpdated = (currentValues) => {
    if (subSectionType === 'video') {
      if (currentValues.lectureVideo !== modalData.videoUrl) {
        return true
      }
    }
    else {
      if (currentValues.pdfFile !== modalData.pdfUrl) {
        return true
      }
    }
    return false
  }

  // detect whether form is updated or not
  const isFormUpdated = () => {
    const currentValues = getValues()
    // console.log("changes after editing form values:", currentValues)
    if (currentValues.lectureTitle !== modalData.title || currentValues.lectureDesc !== modalData.description || isFileUpdated(currentValues)) {
      return true
    }
    return false
  }

  // handle the editing of subsection
  const handleEditSubsection = async () => {
    const currentValues = getValues()
    // console.log("changes after editing form values:", currentValues)
    const formData = new FormData()
    // console.log("Values After Editing form values:", currentValues)
    formData.append("sectionId", modalData.sectionId)
    formData.append("subSectionId", modalData._id)
    formData.append("type", subSectionType)
    if (currentValues.lectureTitle !== modalData.title) {
      formData.append("title", currentValues.lectureTitle)
    }
    if (currentValues.lectureDesc !== modalData.description) {
      formData.append("description", currentValues.lectureDesc)
    }
    if (subSectionType === "video") {
      if (currentValues.lectureVideo !== modalData.videoUrl) {
        formData.append("video", currentValues.lectureVideo)
      }
    }
    else {
      if (currentValues.pdfFile !== modalData.pdfUrl) {
        formData.append("pdf", currentValues.pdfFile)
        formData.append("fileName", fileName)
      }
    }
    setLoading(true)
    const result = await updateSubSection(formData, token, subSectionType)
    if (result) {
      // console.log("result", result)
      // update the structure of course
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData.sectionId ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
    }
    setModalData(null)
    setLoading(false)
  }

  const onSubmit = async (data) => {
    // console.log(data)
    if (view) return

    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No changes made to the form")
      } else {
        handleEditSubsection()
      }
      return
    }

    const formData = new FormData()
    formData.append("sectionId", modalData)
    formData.append("title", data.lectureTitle)
    formData.append("description", data.lectureDesc)
    formData.append("type", subSectionType)
    if (subSectionType === "video") formData.append("video", data.lectureVideo)
    else {
      formData.append("pdf", data.pdfFile)
      formData.append("fileName", fileName)
    }

    setLoading(true)
    const result = await createSubSection(formData, token, subSectionType)
    if (result) {
      // update the structure of course
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
    }
    setModalData(null)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} {subSectionType === 'video' ? "Video Lecture" : "PDF"}
          </p>
          <button onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>
        {/* Modal Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 px-8 py-10"
        >
          {/* Lecture Video Upload */}
          <Upload
            name={subSectionType === 'video' ? "lectureVideo" : "pdfFile"}
            label={subSectionType === 'video' ? "Lecture Video" : "PDF File"}
            subSectionType={subSectionType}
            register={register}
            setValue={setValue}
            errors={errors}
            viewData={view ? subSectionType === 'video' ? modalData.videoUrl : modalData.pdfUrl : null}
            editData={edit ? subSectionType === 'video' ? modalData.videoUrl : modalData.pdfUrl : null}
            fileName={fileName}
            setFileName={setFileName}
          />
          {/* Lecture Title */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
              {subSectionType === 'video' ? 'Video Lecture Title' : 'PDF File Title'} {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
              disabled={view || loading}
              id="lectureTitle"
              placeholder={subSectionType === 'video' ? "Enter Video Lecture Title" : "Enter PDF File Title"}
              {...register("lectureTitle", { required: true })}
              className="form-style w-full"
            />
            {errors.lectureTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                {subSectionType === 'video' ? 'Video lecture title ' : 'PDF file title '}
                is required
              </span>
            )}
          </div>
          {/* Lecture Description */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureDesc">
              {subSectionType === 'video' ? 'Video Lecture' : 'PDF File'} Description{" "}
              {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <textarea
              disabled={view || loading}
              id="lectureDesc"
              placeholder={subSectionType === 'video' ? "Enter Lecture Description" : "Enter PDF Description"}
              {...register("lectureDesc", { required: true })}
              className="form-style resize-x-none min-h-[130px] w-full"
            />
            {errors.lectureDesc && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                {subSectionType === 'video' ? 'Video lecture description ' : 'PDF description '} is required
              </span>
            )}
          </div>
          {!view && (
            <div className="flex justify-end">
              <IconBtn
                disabled={loading}
                text={loading ? "Loading.." : edit ? "Save Changes" : "Save"}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

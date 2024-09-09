import { HiOutlineVideoCamera } from "react-icons/hi"
import { BsFiletypePdf } from "react-icons/bs";

function CourseSubSectionAccordion({ subSec }) {

  return (
    <div>
      <div className="flex justify-between py-2">
        <div className={`flex items-center gap-2`}>
          <span>
            {subSec.type === "video" ? <HiOutlineVideoCamera /> : <BsFiletypePdf />}
          </span>
          <p>{subSec?.title}</p>
        </div>
      </div>
    </div>
  )
}

export default CourseSubSectionAccordion

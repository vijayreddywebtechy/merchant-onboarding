import BusinessDetailsForm from "@/components/onboarding/BusinessDetailsForm"
import TellusMore from "@/components/onboarding/TellusMore"
import VerifyBlock from "@/components/VerifyIdentity/VerifyBlock"

type Props = {}

const page = (props: Props) => {
  return (
    <>
      <TellusMore/>
      <BusinessDetailsForm/>
      <VerifyBlock />
    </>
  )
}

export default page
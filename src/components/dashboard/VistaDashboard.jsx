import ResumenGeneral from './ResumenGeneral'
import ProductsSection from './tables/ProductsSection'
import CampaignChart from '../ai/CampaignChart'
import ProgressCircles from './ProgressCircles'
import CampaignsRequirements from '../ai/CampaignsRequirements'
import AgentsPlans from './AgentsPlans'

export default function VistaDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <ResumenGeneral />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CampaignChart />
        <ProgressCircles />
      </div>
      <ProductsSection />
      <CampaignsRequirements />
      <AgentsPlans />
    </div>
  )
}

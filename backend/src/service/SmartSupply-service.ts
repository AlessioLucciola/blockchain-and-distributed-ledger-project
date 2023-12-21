import SmartSupplyRepository from "../repository/SmartSupply-repository"

class SmartSupplyService {
    repository: SmartSupplyRepository

    constructor() {
        this.repository = new SmartSupplyRepository()
    }

    //Insert methods here
}

export default SmartSupplyService
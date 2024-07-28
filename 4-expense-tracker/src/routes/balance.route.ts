import { Router } from 'express';
import { GroupService } from '../modules/Group/services/group.service';
import { GroupRepository } from '../modules/Group/repositories/group.repository';
import { handleExpress } from '../utility/handle-express';


export const makeBalanceRouter = (groupService: GroupService) => {
    const router = Router();

    router.get("/:id", (req, res) => {
        const groupId = req.params.id;
    
        handleExpress(res, async () => groupService.getGroupTransactions(groupId));
    });

    return router;
};
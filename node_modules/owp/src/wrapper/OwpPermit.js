import { OwpStorage } from 'owp/common';

const OwpPermit = function (pageid, crudtype) {
    let PERMIT = OwpStorage.getItem('PERMIT');
    let RPERMIT = {};

    if (crudtype) {
        crudtype = crudtype + '_PERMISSION';

        if (PERMIT && pageid) {
            PERMIT = PERMIT[pageid];

            if (PERMIT[crudtype] === 'T') {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        if (PERMIT && pageid) {
            PERMIT = PERMIT[pageid];

            if (PERMIT['C_PERMISSION'] === 'T') {
                RPERMIT.C_PERMISSION = true;
            } else {
                RPERMIT.C_PERMISSION = false;
            }
            if (PERMIT['U_PERMISSION'] === 'T') {
                RPERMIT.U_PERMISSION = true;
            } else {
                RPERMIT.U_PERMISSION = false;
            }
            if (PERMIT['D_PERMISSION'] === 'T') {
                RPERMIT.D_PERMISSION = true;
            } else {
                RPERMIT.D_PERMISSION = false;
            }
            if (PERMIT['R_PERMISSION'] === 'T') {
                RPERMIT.R_PERMISSION = true;
            } else {
                RPERMIT.R_PERMISSION = false;
            }

            return RPERMIT;
        } else {
            RPERMIT.C_PERMISSION = true;
            RPERMIT.U_PERMISSION = true;
            RPERMIT.D_PERMISSION = true;
            RPERMIT.R_PERMISSION = true;

            return RPERMIT;
        }
    }
};

export default OwpPermit;

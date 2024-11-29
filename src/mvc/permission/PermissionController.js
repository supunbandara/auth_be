const PermissionModel = require('./PermissionModel');

const getAllPermissions = async (req, res) => {
    try {
        const results = await PermissionModel.getAllPermissions();
        res.status(200).send(results);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
    }
};

const getAllPermissionsWithPagination = async (req, res) => {
    const { page, pageSize } = req.query;

    // Convert page and pageSize to integers (you may want to validate and sanitize the inputs)
    const pageNumber = parseInt(page, 10);
    const itemsPerPage = parseInt(pageSize, 10);

    if (isNaN(pageNumber) || isNaN(itemsPerPage) || pageNumber < 0 || itemsPerPage <= 0) {
        return res.status(400).send({ error: "Invalid page or pageSize parameter" });
    }

    let offset = pageNumber * itemsPerPage;

    try {
        const { results, totalItems } = await PermissionModel.getAllPermissionsWithPagination(offset, itemsPerPage);
        res.status(200).send({ data: results, totalItems });
    } catch (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
    }
};

const getPermissionById = async (req, res) => {
    const { permissionId } = req.params;

    try {
        const results = await PermissionModel.getPermissionById(permissionId);
        if (results.length === 0) {
            res.status(404).send({ error: 'Permission not found' });
        } else {
            res.status(200).send(results);
        }
    } catch (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
    }
};

const addPermission = async (req, res) => {
    const permission = req.body;

    try {
        const existingPermissions = await PermissionModel.getPermissionByCode(permission.permission_code);
        if (existingPermissions.length > 0) {
            res.status(409).send({ error: 'This Permission Code already exists' });
        } else {
            const permissionId = await PermissionModel.addPermission(permission);
            res.status(200).send({ message: 'Permission created successfully', permissionId });
        }
    } catch (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
    }
};

const updatePermission = async (req, res) => {
    const { permissionId } = req.params;
    const permission = req.body;

    try {
        const existingPermission = await PermissionModel.getPermissionById(permissionId);

        if (!existingPermission[0]) {
            res.status(404).send({ error: 'Permission not found' });
        } else {
            if (permission.permission_code && permission.permission_code !== existingPermission[0].permission_code) {
                const existingPermissions = await PermissionModel.getPermissionByCode(permission.permission_code);
                if (existingPermissions.length > 0) {
                    res.status(409).send({ error: 'Permission code already exists' });
                } else {
                    await PermissionModel.updatePermission(permission, permissionId);
                    res.status(200).send({ message: 'Permission updated successfully' });
                }
            } else {
                await PermissionModel.updatePermission(permission, permissionId);
                res.status(200).send({ message: 'Permission updated successfully' });
            }
        }
    } catch (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
    }
};

const permanentDeletePermission = async (req, res) => {
    const { permissionId } = req.params;

    try {
        const existingPermission = await PermissionModel.getPermissionById(permissionId);

        if (existingPermission.length === 0) {
            res.status(404).send({ error: 'Permission not found' });
        } else {
            await PermissionModel.deletePermission(permissionId);
            res.status(200).send({ message: 'Permission deleted successfully' });
        }
    } catch (error) {
        res.status(500).send({ error: 'Error deleting permission from the database' });
    }
};

module.exports = {
    getAllPermissions,
    getPermissionById,
    getAllPermissionsWithPagination,
    addPermission,
    updatePermission,
    permanentDeletePermission,
};

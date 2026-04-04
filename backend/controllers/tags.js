let tagModel = require('../schemas/tags');
let appModel = require('../schemas/apps');


async function getAllTags(req, res) {
    try {
        let { search, page, limit, sortBy, order } = req.query;

        let filter = { isDeleted: false };

        if (search) {
            filter.name = { $regex: search.trim().toLowerCase(), $options: 'i' };
        }

        let pageNum  = parseInt(page)  || 1;
        let limitNum = parseInt(limit) || 20;
        let sortField = ['name', 'createdAt'].includes(sortBy) ? sortBy : 'createdAt';
        let sortOrder = order === 'asc' ? 1 : -1;

        let [tags, total] = await Promise.all([
            tagModel.find(filter)
                .sort({ [sortField]: sortOrder })
                .skip(limitNum * (pageNum - 1))
                .limit(limitNum),
            tagModel.countDocuments(filter)
        ]);

        res.send({
            data: tags,
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum)
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}


async function getTagById(req, res) {
    try {
        let tag = await tagModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!tag) return res.status(404).send({ message: 'Tag not found' });

        let apps = await appModel.find({
            _id: { $in: tag.appIds },
            isDeleted: false,
            status: 'published'
        })
            .populate('developerId', 'fullName email avatarUrl')
            .populate('categoryId', 'name iconUrl')
            .sort({ createdAt: -1 });

        res.send({ tag, apps });
    } catch (error) {
        res.status(404).send({ message: 'Tag not found' });
    }
}


async function createTag(req, res) {
    try {
        let { name } = req.body;
        if (!name) return res.status(400).send({ message: 'Tag name is required' });

        let tag = new tagModel({ name: name.trim().toLowerCase() });
        await tag.save();
        res.status(201).send(tag);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).send({ message: 'Tag already exists' });
        }
        res.status(400).send({ message: error.message });
    }
}


async function updateTag(req, res) {
    try {
        let tag = await tagModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!tag) return res.status(404).send({ message: 'Tag not found' });

        if (req.body.name) tag.name = req.body.name.trim().toLowerCase();
        await tag.save();
        res.send(tag);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).send({ message: 'Tag name already exists' });
        }
        res.status(400).send({ message: error.message });
    }
}


async function deleteTag(req, res) {
    try {
        let tag = await tagModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!tag) return res.status(404).send({ message: 'Tag not found' });

        tag.isDeleted = true;
        await tag.save();
        res.send({ message: 'Tag deleted', tag });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}


async function addTagToApp(req, res) {
    try {
        let { appId } = req.body;
        if (!appId) return res.status(400).send({ message: 'appId is required' });

        let [tag, app] = await Promise.all([
            tagModel.findOne({ _id: req.params.id, isDeleted: false }),
            appModel.findOne({ _id: appId, isDeleted: false })
        ]);

        if (!tag) return res.status(404).send({ message: 'Tag not found' });
        if (!app)  return res.status(404).send({ message: 'App not found' });

        let userController = require('./users');
        let user = await userController.FindUserById(req.userId);
        let isAdmin = user && user.role && user.role.name === 'ADMIN';
        if (app.developerId.toString() !== req.userId && !isAdmin) {
            return res.status(403).send({ message: 'Bạn không có quyền gắn tag cho app này' });
        }

        if (!tag.appIds.map(id => id.toString()).includes(appId)) {
            tag.appIds.push(appId);
            await tag.save();
        }

        res.send({ message: 'Tag added to app', tag });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}


async function removeTagFromApp(req, res) {
    try {
        let { appId } = req.body;
        if (!appId) return res.status(400).send({ message: 'appId is required' });

        let [tag, app] = await Promise.all([
            tagModel.findOne({ _id: req.params.id, isDeleted: false }),
            appModel.findOne({ _id: appId, isDeleted: false })
        ]);

        if (!tag) return res.status(404).send({ message: 'Tag not found' });
        if (!app)  return res.status(404).send({ message: 'App not found' });

        let userController = require('./users');
        let user = await userController.FindUserById(req.userId);
        let isAdmin = user && user.role && user.role.name === 'ADMIN';
        if (app.developerId.toString() !== req.userId && !isAdmin) {
            return res.status(403).send({ message: 'Bạn không có quyền gỡ tag khỏi app này' });
        }

        tag.appIds = tag.appIds.filter(id => id.toString() !== appId);
        await tag.save();

        res.send({ message: 'Tag removed from app', tag });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

async function getAppsByTagName(req, res) {
    try {
        let name = req.params.name.trim().toLowerCase();
        let { page, limit, categoryId } = req.query;

        let tag = await tagModel.findOne({ name, isDeleted: false });
        if (!tag) return res.status(404).send({ message: 'Tag not found' });

        let pageNum  = parseInt(page)  || 1;
        let limitNum = parseInt(limit) || 20;

        let appFilter = {
            _id: { $in: tag.appIds },
            isDeleted: false,
            status: 'published'
        };
        if (categoryId) appFilter.categoryId = categoryId;

        let [apps, total] = await Promise.all([
            appModel.find(appFilter)
                .populate('developerId', 'fullName email avatarUrl')
                .populate('categoryId', 'name iconUrl')
                .sort({ createdAt: -1 })
                .skip(limitNum * (pageNum - 1))
                .limit(limitNum),
            appModel.countDocuments(appFilter)
        ]);

        res.send({
            tag,
            data: apps,
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum)
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

module.exports = {
    getAllTags,
    getTagById,
    createTag,
    updateTag,
    deleteTag,
    addTagToApp,
    removeTagFromApp,
    getAppsByTagName
};

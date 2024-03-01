const router = require('express').Router();
const { Category, Product, Tag, ProductTag } = require('../../models');



router.get('/', async (req, res) => {
    try {
        const productData = await Product.findAll({
            include: [Category, {
                model: Tag,
                through: ProductTag
            }]
        });
        if (!productData) {
            res.status(400).json({ message: 'No products' });
            return;
        }
        res.status(200).json(productData);
    } catch (err) {
        res.status(500).json(err);
    }
});


router.get('/:id', async (req, res) => {
    try {
        const productData = await Product.findOne({
            where: {
                id: req.params.id,
            },
            include: [Category, {
                model: Tag,
                through: ProductTag
            }],
        });

        if (!productData) {
            res.status(400).json({ message: 'No product with that id' });
            return;
        }
        res.status(200).json(productData);
    } catch (err) {
        res.status(500).json(err);
    }
});


router.post('/', async (req, res) => {
    /*
    {
        "product_name": "Basketball",
        "price": 200.00,
        "stock": 3,
        "category_id": 1,
        "tagIds": [1, 2, 3, 4]
    }
    */
    try {
        const newProductData = await Product.create(req.body);
        if (req.body.tagIds && req.body.tagIds.length) {
            const productTagIdArr = req.body.tagIds.map((tag_id) => {
                return {
                    product_id: newProductData.id,
                    tag_id,
                };
            });
            const productTagData = await ProductTag.bulkCreate(productTagIdArr);
            res.status(200).json({ tags: productTagData });
        }
        res.status(200).json(newProductData);
    } catch (err) {
        res.status(400).json(err)
    }
});


router.put('/:id', async (req, res) => {
    try {
        const productData = await Product.update(req.body, {
            where: {
                id: req.params.id,
            },
        });
        if (req.body.tagIds && req.body.tagIds.length) {
            const productTags = ProductTag.findAll({ where: { product_id: req.params.id } });

            const productTagIds = productTags.map(({ tag_id }) => tag_id);
            const newProductTags = req.body.tagIds
                .filter((tag_id) => !productTagIds.includes(tag_id))
                .map((tag_id) => {
                    return {
                        product_id: req.params.id,
                        tag_id
                    }
                })
            const productTagsToRemove = (await productTags).filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);

            await ProductTag.destroy({ where: { id: productTagsToRemove } });
            await ProductTag.bulkCreate(newProductTags);

            return res.json(productData);
        }

        res.status(200).json(productData);
    } catch (err) {
        res.status(400).json(err);
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const productData = await Product.destroy({
            where: {
                id: req.params.id,
            },
        });
        if (productData) {
            res.status(200).json({ status: `deleted product id = ${req.params.id}` });
        } else {
            res.status(400).json({ status: `no product of id = ${req.params.id}` });
        }
    } catch (err) {
        res.status(400).json(err);
    }
});




module.exports = router;
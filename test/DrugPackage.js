const DrugPackage = artifacts.require('./DrugPackage.sol')

require('chai').use(require('chai-as-promised')).should()

contract('DrugPackage', ([manufacturer, client, logistic]) => {
    let drugPackage

    before(async () => {
        drugPackage = await DrugPackage.deployed()
    })

    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = await drugPackage.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })
        it('has a name', async () => {
            const name = await drugPackage.name()
            assert.equal(name, 'Capsule Drug Package')
        })
    })

    describe('orders', async () => {
        let result, orderCount

        before(async () => {
            result = await drugPackage.createOrder('Calpol','100', '26/11/2020', '100F', 'confirmed', { from: client })
            orderCount = await drugPackage.orderCount()
        })

        it('creates order', async () => {

            //Success
            assert.equal(orderCount, 1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), orderCount.toNumber(), 'id is correct')
            assert.equal(event.content, 'Calpol', 'content is correct')
            assert.equal(event.quantity, '100', 'quantity is correct')
            assert.equal(event.expiryDate, '26/11/2020', 'expiry date is correct')
            assert.equal(event.temperature, '100F', 'temperature is correct')
            assert.equal(event.status, 'confirmed', 'status is correct')
            assert.equal(event.client, client, 'client is correct')

            //Failure : Order must have content
            await drugPackage.createOrder('','', '', '', '', { from: client }).should.be.rejected;
        })
        it('views order', async () => {
            const order = await drugPackage.orders(orderCount)
            assert.equal(order.id.toNumber(), orderCount.toNumber(), 'id is correct')
            assert.equal(order.content, 'Calpol', 'content is correct')
            assert.equal(order.quantity, '100', 'quantity is correct')
            assert.equal(order.expiryDate, '26/11/2020', 'expiry date is correct')
            assert.equal(order.temperature, '100F', 'temperature is correct')
            assert.equal(order.status, 'confirmed', 'status is correct')
            assert.equal(order.client, client, 'client is correct')
        })
        it('deploys order', async () => {
            result = await drugPackage.deployOrder(orderCount, { from: manufacturer })

            //Success
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), orderCount.toNumber(), 'id is correct')
            assert.equal(event.status, 'deployed', 'status is correct')
            assert.equal(event.client, client, 'client is correct')

            //Failure: ensure a valid order id is passed
            await drugPackage.deployOrder(99, { from: manufacturer }).should.be.rejected;

        })
        // it('tracks order', async () => {
        // })
        it('delivers order', async () => {
            result = await drugPackage.deliverOrder(orderCount, { from: client })

            //Success
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), orderCount.toNumber(), 'id is correct')
            assert.equal(event.status, 'delivered', 'status is correct')
            assert.equal(event.client, client, 'client is correct')

            //Failure: ensure a valid order id is passed
            await drugPackage.deployOrder(99, { from: manufacturer }).should.be.rejected;
        })
    })
})
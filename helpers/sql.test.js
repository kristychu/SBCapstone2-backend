const { sqlForPartialUpdate } = require("./sql");
const { BadRequestError } = require("../expressError");

describe("SQL for Partial Update", function () {
    const updateData = {
        firstName: "UpdatedFirst"
      };
    
    // JS key name from updateData to SQL column name
    const colData = {
        firstName: "first_name"
    };

    test("works", function () {
        const partialUpdate = sqlForPartialUpdate(updateData, colData);
        expect(partialUpdate).toEqual({
            setCols: '"first_name"=$1',
            values: ['UpdatedFirst']
        });
    });

    test("bad request with no data", function (){
        try{
            const emptyData = {};
            sqlForPartialUpdate(emptyData, colData);
        } catch(err){
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});
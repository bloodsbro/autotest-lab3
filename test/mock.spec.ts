import { gauss_forward, gauss_backward, gauss } from 'gauss/gauss_functions';
import matrix from 'gauss/matrix';

import * as sinon from "sinon";
import * as chai from "chai";
import sinonChai from "sinon-chai";

chai.use(sinonChai);
const expect = chai.expect;

describe('Тести на усунення Гаусса', function() {
  let matrixMock;

  beforeEach(function() {
    // Створюємо мок для класу matrix
    matrixMock = sinon.createStubInstance(matrix);
  });

  afterEach(function() {
    sinon.restore();
  });

  it('має виконувати пряме усунення в gauss_forward', function() {
    matrixMock.get_rows.returns(3);
    matrixMock.get_cols.returns(4);
    matrixMock.get.withArgs(0, 0).returns(1);
    matrixMock.get.withArgs(1, 0).returns(2);
    matrixMock.get.withArgs(2, 0).returns(0);

    gauss_forward(matrixMock);

    expect(matrixMock.mull_add).to.have.been.called;
    expect(matrixMock.swap_with_nonzero_row).not.to.have.been.called;
  });

  it('має виконувати зворотне виключення і повертати розв\'язки в gauss_backward', function() {
    matrixMock.get_rows.returns(3);
    matrixMock.get_cols.returns(4);

    matrixMock.get.withArgs(2, 3).returns(4);
    matrixMock.get.withArgs(2, 2).returns(1);
    matrixMock.get.withArgs(1, 3).returns(9);
    matrixMock.get.withArgs(1, 2).returns(3);
    matrixMock.get.withArgs(1, 1).returns(1);
    matrixMock.get.withArgs(0, 3).returns(10);
    matrixMock.get.withArgs(0, 2).returns(1);
    matrixMock.get.withArgs(0, 1).returns(2);
    matrixMock.get.withArgs(0, 0).returns(1);

    const solutions = gauss_backward(matrixMock);

    expect(solutions).to.be.an('array').that.includes.members([12, -3, 4]);
    expect(matrixMock.get).to.have.been.called;
  });

  it('повинна повертати нуль, якщо існує неправильний або нульовий рядок у гаусах', function() {
    matrixMock.exists_wrong_row.returns(true);
    matrixMock.exists_zero_row.returns(false);

    const result = gauss(matrixMock);

    expect(result).to.be.null;
  });

  it('має виконувати як пряме, так і зворотне усунення в гаусі', function() {
    matrixMock.get_rows.returns(3);
    matrixMock.get_cols.returns(4);
    matrixMock.exists_wrong_row.returns(false);
    matrixMock.exists_zero_row.returns(false);
    matrixMock.get.returns(1); // general return for get method

    const result = gauss(matrixMock);

    expect(result).to.be.an('array');
    expect(matrixMock.mull_add).to.have.been.called;
    expect(matrixMock.swap_with_nonzero_row).not.to.have.been.called;
  });
});

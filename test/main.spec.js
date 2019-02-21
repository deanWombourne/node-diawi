const assert = require('assert');
const exec = require('child_process').execSync;
const SEGUNDOS = 1000;

describe('command-line tests', function() {
  before(function() {
    this.timeout(10 * SEGUNDOS);
    exec('npm link');
  });

  after(function() {
    this.timeout(10000);
    exec('npm unlink');
  });

  beforeEach(function() {

  });

  afterEach(function() {

  });

  it('should return semver version number when called with --version', function() {
    const version = exec('diawi --version').toString();
    const semverPattern = /^\d*\.\d*\.\d*\n$/;
    assert(version.toString().match(semverPattern), 'Versão: ' + version.toString());
  });

  it('should throw when called with no params', function() {
    assert.throws(() => {
      exec('diawi');
    });
  });

  it('should throw when called with unrecognized param', function() {
    assert.throws(() => {
      exec('diawi --qweqwe');
    });
  });

  it('should throw when called with unrecognized param', function() {
    assert.throws(() => {
      exec('diawi --qweqwe');
    });
  });
});

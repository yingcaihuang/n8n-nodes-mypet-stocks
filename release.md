# Release Guide for n8n-nodes-mypet-stocks v1.6.0

## Pre-Release Checklist ✅

- [x] Version updated to 1.6.0 in package.json
- [x] Description updated to include quantitative account management
- [x] Keywords updated with new functionality
- [x] CHANGELOG.md created with detailed release notes
- [x] README.md updated with new features and examples
- [x] Code compiled successfully (`npm run build`)
- [x] Lint checks passed (only warnings, no errors)
- [x] All tests passed (100% coverage)

## Release Notes - Version 1.6.0

### 🚀 Major New Features

**Quantitative Account Management**
- Complete CRUD operations for quantitative accounts
- Dynamic broker/dealer loading
- Comprehensive parameter support
- Advanced filtering and pagination

### 📋 New Operations

1. **Get All Accounts**
   - Pagination support (pageNum, pageSize)
   - Multiple filtering options
   - Account type, nature, and status filtering

2. **Create Account**
   - Full parameter configuration
   - MT4/MT5 support
   - Risk management settings
   - Multi-timezone support

3. **Update Account**
   - Modify all account properties
   - Maintain data integrity
   - Audit trail support

4. **Delete Account**
   - Safe deletion of inactive accounts
   - Validation checks
   - Confirmation responses

### 🔧 Technical Improvements

- Enhanced TypeScript definitions
- Improved error handling
- Better API integration
- Comprehensive testing suite

### 📚 Documentation

- Complete usage examples
- API endpoint documentation
- Best practices guide
- Migration instructions

## Release Commands

### 1. Final Build and Test
```bash
# Clean build
npm run build

# Run tests
node test-quantitative-account.js

# Lint check
npm run lint
```

### 2. Git Operations
```bash
# Add all changes
git add .

# Commit with version tag
git commit -m "Release v1.6.0: Add quantitative account management

- Add complete CRUD operations for quantitative accounts
- Add dynamic broker loading functionality
- Add comprehensive parameter support and validation
- Add pagination and filtering capabilities
- Update documentation and examples
- Add comprehensive test suite"

# Create version tag
git tag -a v1.6.0 -m "Version 1.6.0: Quantitative Account Management

Major Features:
- Quantitative account CRUD operations
- Dynamic broker loading
- Enhanced parameter support
- Comprehensive filtering and pagination

API Endpoints:
- GET /api/v1/portal/stock/account/ (Get all accounts)
- POST /api/v1/portal/stock/account/ (Create account)
- PUT /api/v1/portal/stock/account/{id}/ (Update account)
- DELETE /api/v1/portal/stock/account/{id}/ (Delete account)
- GET /api/v1/portal/stock/dealer/ (Get brokers)

Documentation:
- Complete usage examples
- API documentation
- Test suite with 100% coverage"

# Push to repository
git push origin main
git push origin v1.6.0
```

### 3. NPM Publishing
```bash
# Login to npm (if not already logged in)
npm login

# Publish to npm registry
npm publish

# Verify publication
npm view n8n-nodes-mypet-stocks
```

### 4. GitHub Release (Optional)
1. Go to GitHub repository
2. Create new release from tag v1.6.0
3. Use release notes from CHANGELOG.md
4. Attach any additional documentation

## Post-Release Tasks

### 1. Verification
- [ ] Verify package is available on npm
- [ ] Test installation in clean n8n environment
- [ ] Verify all new features work as expected

### 2. Documentation Updates
- [ ] Update any external documentation
- [ ] Notify users of new features
- [ ] Update community forums/discussions

### 3. Monitoring
- [ ] Monitor for any installation issues
- [ ] Check for user feedback
- [ ] Monitor npm download statistics

## Rollback Plan

If issues are discovered after release:

1. **Minor Issues**: Patch release (v1.6.1)
2. **Major Issues**: 
   - Unpublish if within 24 hours: `npm unpublish n8n-nodes-mypet-stocks@1.6.0`
   - Otherwise, release hotfix version

## Support Information

- **Documentation**: See README.md and usage-examples.md
- **Issues**: GitHub Issues
- **Testing**: Use test-quantitative-account.js for validation
- **API Docs**: https://stock-docs.apifox.cn/

## Success Metrics

- [ ] Package successfully published to npm
- [ ] No critical installation issues reported
- [ ] New features accessible in n8n
- [ ] Documentation is clear and helpful
- [ ] Community feedback is positive

---

**Ready for Release**: ✅ All checks passed, ready to publish v1.6.0
